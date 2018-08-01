import * as _ from 'lodash';
import * as path from 'path';
import * as fs from 'fs';

import { Callback, Request, Response } from './../../config/Types';
import { CustomAuthorizerEvent, APIGatewayEventRequestContext } from 'aws-lambda';

import DatabaseConnection from './../resources/DatabaseConnection';
import Validator from './../Validator';

const terminate = (error: string) => {
  return {
    status: 400,
    payload: { error },
  };
};

/** dataDependencies:
 * a list of retrieved data fields returned by
 * the resolve function for each controller method in previous data flow(s)
 * used to feed intermediary data from previous data flow(s)
 * into the current data flow
 * you can ignore dataDependencies if the current data flow does not depend on any
 * previously retrieved data
 * (the intermediary data fields are stored in this.dataStore)
 * (make sure that they do not overwrite each other)
 * (check the naming in the object returned by resolve for each controller method)
 */

// storageSpecs: store all output specified by the transform function of controller by default

interface DataflowDefinition {
  controller: any; // class to instantiate from
  method: string;
  target: any; // class to instantiate from
  targetType?: string; // resource (default) | api
  dataDependencies?: string[];
  authDataDependencies?: string[];
  validationMap?: any;
  methodMap?: any; // a map of methods on controller to methods on target
  storageSpecs?: string[]; // a list of output names to store to intermediary data store
  skipOn?: any; // skip current data flow if any key-value pair can be found in data store
}

interface Dataflow {
  dataDependencies: string[];
  authDataDependencies: string[];
  controller: any;
  controllerMethod: string;
  validator: Validator;
  target: any;
  targetMethod: string;
  storageSpecs: string[];
  skipOn: any;
}

export default class PackageService {
  private controllerMap: any;
  private resourceMap: any;
  private webEndpointMap: any; // for Github APIs later on
  private dataflows: Dataflow[];
  private dataStore: any;
  private initialData: any;
  private tokenContents: any;

  constructor(dataflows: DataflowDefinition[]) {
    this.dataflows = [];
    this.dataStore = {};

    this.addDataflows(dataflows);

    this.executeDataflows = this.executeDataflows.bind(this);
  }

  addDataflow(dataflowDefinition: DataflowDefinition) {
    const controller = this.createController(dataflowDefinition.controller);
    let target: any;

    switch (dataflowDefinition.targetType) {
      case undefined:
      case 'resource':
        target = this.createResource(dataflowDefinition.target);
        break;
      case 'api':
        target = this.createAPI(dataflowDefinition.target);
        break;
      default:
        throw `Target type ${dataflowDefinition.targetType} is not supported`;
    }

    /** by default, the targetMethod has the same name as the controllerMethod
     * if methodMap is not provided
     */
    const controllerMethod = dataflowDefinition.method;
    let targetMethod = controllerMethod;

    if (dataflowDefinition.methodMap !== undefined) {
      if (dataflowDefinition.methodMap[controllerMethod] === undefined) {
        throw 'Controller method not defined in method map';
      }
      targetMethod = dataflowDefinition.methodMap[controllerMethod];
    }

    // get dataDependencies
    const { dataDependencies } = dataflowDefinition;
    const { authDataDependencies } = dataflowDefinition;

    // create validator
    let validator = undefined;
    if (dataflowDefinition.validationMap !== undefined) {
      validator = new Validator(dataflowDefinition.validationMap[controllerMethod]);
    }

    // get storageSpecs
    const { storageSpecs, skipOn } = dataflowDefinition;

    const dataflow = {
      dataDependencies,
      authDataDependencies,
      controller,
      controllerMethod,
      validator,
      target,
      targetMethod,
      storageSpecs,
      skipOn,
    };

    this.dataflows.push(dataflow);
  }

  addDataflows(dataflowDefinitions: DataflowDefinition[]) {
    _.forEach(dataflowDefinitions, (dataflowDefinition: DataflowDefinition) => {
      this.addDataflow(dataflowDefinition);
    });
  }

  createController(Controller: any) {
    return new Controller();
  }

  createResource(Resource: any) {
    return new Resource(new DatabaseConnection());
  }

  createAPI(API: any) {
    return new API();
  }

  executeDataflows(resolve: any, reject: any) {
    if (this.dataflows.length === 0) {
      reject(terminate('No dataflow has been added'));
    }

    this.validate(this.dataflows[0], this.initialData, resolve, reject);

    /** at this point, initial data only contains req.body or req.params
     * we check if dataDependencies for the first data flow is specified
     * and try to retrieve additional data from tokenContents if specified
     * note that initial data may be pruned if dataDependencies is a subset of initial data
     * and tokenContents data will overwrite initialData if the field name is not unique
     */
    this.extractInitialDataDependencies();

    // store initialData in dataStore
    _.assign(this.dataStore, this.initialData);

    let chainedPromise = this.getPromise(this.initialData, this.dataflows[0]);
    let thisDataflow: Dataflow = this.dataflows[0];
    let nextDataflow: Dataflow;

    _.forEach(_.range(this.dataflows.length - 1), (i: number) => {
      // handle the case where the first data flow is skipped
      if (!chainedPromise) {
        thisDataflow = this.dataflows[i];
        chainedPromise = this.getPromise(this.initialData, thisDataflow);
        if (!chainedPromise) return;
      }
      // skip next data flow if conditions is satisfied
      nextDataflow = this.dataflows[i + 1];
      if (this.shouldSkip(nextDataflow)) return;

      chainedPromise = this.chainPromise(
        chainedPromise,
        thisDataflow,
        nextDataflow,
        resolve,
        reject,
      );

      thisDataflow = nextDataflow;
    });

    if (!chainedPromise) reject(terminate('All dataflows were skipped'));

    // handle last promise without chaining
    const lastDataflow = this.dataflows[this.dataflows.length - 1];
    chainedPromise
      .then((result: any) => resolve(this.transform(lastDataflow)(result)))
      .catch((error: string) => reject(terminate(error)));
  }

  getPromise(data: any, dataflow: Dataflow) {
    if (this.shouldSkip(dataflow)) return;
    return dataflow.target[dataflow.targetMethod](data);
  }

  pickData(dataflow: Dataflow) {
    if (dataflow.dataDependencies !== undefined && dataflow.dataDependencies.length > 0) {
      dataflow.dataDependencies.forEach((field: string) => {
        if (!(field in this.dataStore)) {
          console.log('Logging intermediate data store between data flows..');
          console.log(this.dataStore);
          throw `PackageService Error: ${field} is expected but cannot be found in the data store`;
        }
      });
      return _.pick(this.dataStore, dataflow.dataDependencies);
    }
    return Object.assign({}, this.dataStore);
  }

  shouldSkip(dataflow: Dataflow) {
    if (!dataflow.skipOn) return false;
    let flag = false;
    _.forOwn(dataflow.skipOn, (value: any, key: any) => {
      if (key in this.dataStore && this.dataStore[key] === value) flag = true;
    });
    return flag;
  }

  validate(dataflow: Dataflow, data: any, resolve: any, reject: any) {
    const validator = dataflow.validator;
    if (validator === undefined) return;
    const valid = validator.validate(data);
    if (!valid) reject(validator.getErrorResponse());
  }

  extractInitialDataDependencies() {
    // extract data from token if authDataDependencies is defined
    if (this.dataflows[0].authDataDependencies !== undefined
      && typeof this.dataflows[0].authDataDependencies.length === 'number'
      && this.dataflows[0].authDataDependencies.length > 0
    ) {
      const authorizerData = _.pick(this.tokenContents, this.dataflows[0].authDataDependencies);
      _.assign(this.initialData, authorizerData);
    }
    // prune data is dataDependencies is defined
    if (this.dataflows[0].dataDependencies !== undefined
      && typeof this.dataflows[0].dataDependencies.length === 'number'
      && this.dataflows[0].dataDependencies.length > 0
    ) {
      this.initialData = _.pick(this.initialData, this.dataflows[0].dataDependencies);
    }
  }

  chainPromise(
    promise: Promise<any>,
    thisDataflow: Dataflow,
    nextDataflow: Dataflow,
    resolve: any,
    reject: any,
    chained: boolean = true,
  ) {
    const { storageSpecs } = thisDataflow;

    return promise
      .then((result: any) => {
        // store output from thisDataflow to dataStore if storageSpecs is specified
        let output = this.transform(thisDataflow)(result);
        if (storageSpecs !== undefined) {
          output = _.pick(output, storageSpecs);
          _.assign(this.dataStore, output);
        }

        // obtain data fields for nextDataflow
        const data = this.pickData(nextDataflow);
        // validate data fields
        this.validate(nextDataflow, data, resolve, reject);
        return this.getPromise(data, nextDataflow);
      });
  }

  /** dataStore contains all data accumulated since the first dataflows
   * we pass it to the controller method to get whatever data it needs
   */
  transform(dataflow: Dataflow) {
    return dataflow.controller[dataflow.controllerMethod](this.dataStore);
  }

  respond(callback: any) {
    return (response: any) => {
      callback(response);
      this.dataStore = {};
    };
  }

  package(
    onSuccess: any,
    onFailure: any,
    initialData: any = undefined,
    tokenContents: any = undefined,
  ) {
    this.initialData = initialData;
    this.tokenContents = tokenContents;
    const dataflowsPromise = new Promise(this.executeDataflows);
    dataflowsPromise.then(this.respond(onSuccess)).catch(this.respond(onFailure));
  }
}
