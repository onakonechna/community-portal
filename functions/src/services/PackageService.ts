import * as _ from 'lodash';
import * as path from 'path';
import * as fs from 'fs';

import { Callback, Request, Response } from './../../config/Types';
import { CustomAuthorizerEvent, APIGatewayEventRequestContext } from 'aws-lambda';

import DatabaseConnection from './../resources/DatabaseConnection';
import S3Connection from './../engines/S3Connection';
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
  targetType?: string; // resource (default) | api | engine
  dataDependencies?: string[];
  authDataDependencies?: string[];
  validationMap?: any;
  methodMap?: any; // a map of methods on controller to methods on target
  storageSpecs?: string[]; // a list of output names to store to intermediary data store
  skipWithout?: string[]; // skip current data flow if any key cannot be found in data store
  skipOn?: string[]; // skip current data flow if any key can be found in data store
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
  skipWithout: string[];
  skipOn: string[];
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
      case 'engine':
        target = this.createEngine(dataflowDefinition.target);
        break;
      default:
        throw `Target type ${dataflowDefinition.targetType} is not supported`;
    }

    /** by default, the targetMethod has the same name as the controllerMethod
     * if methodMap is not provided
     */
    const controllerMethod = dataflowDefinition.method;
    let targetMethod = controllerMethod;

    if (typeof dataflowDefinition.methodMap !== 'undefined') {
      if (typeof dataflowDefinition.methodMap[controllerMethod] === 'undefined') {
        throw 'Controller method not defined in method map';
      }
      targetMethod = dataflowDefinition.methodMap[controllerMethod];
    }

    // get dataDependencies
    const { dataDependencies } = dataflowDefinition;
    const { authDataDependencies } = dataflowDefinition;

    // create validator
    let validator = undefined;
    if (typeof dataflowDefinition.validationMap !== 'undefined') {
      validator = new Validator(dataflowDefinition.validationMap[controllerMethod]);
    }

    // get storageSpecs
    const { storageSpecs, skipWithout, skipOn } = dataflowDefinition;

    const dataflow = {
      dataDependencies,
      authDataDependencies,
      controller,
      controllerMethod,
      validator,
      target,
      targetMethod,
      storageSpecs,
      skipWithout,
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

  createEngine(Engine: any) {
    return new Engine(new S3Connection());
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
    _.assign(this.dataStore, this.initialData); 1;

    let chainedPromise = this.shouldSkip(this.dataflows[0])
      ? new Promise((resolve: any) => resolve({}))
      : this.getPromise(this.initialData, this.dataflows[0]);

    let thisDataflow: Dataflow;
    let nextDataflow: Dataflow;

    _.forEach(_.range(this.dataflows.length - 1), (i: number) => {
      thisDataflow = this.dataflows[i];
      nextDataflow = this.dataflows[i + 1];
      chainedPromise = this.chainPromise(
        chainedPromise,
        thisDataflow,
        nextDataflow,
        resolve,
        reject,
      );
    });

    const lastDataflow = this.dataflows[this.dataflows.length - 1];
    chainedPromise
      .then((result: any) => {
        if (this.shouldSkip(lastDataflow)) {
          reject(terminate('Last data flow cannot be skipped'));
          return;
        }
        resolve(this.transform(lastDataflow)(result));
      })
      .catch((error: string) => reject(terminate(error)));
  }

  getPromise(data: any, dataflow: Dataflow) {
    return dataflow.target[dataflow.targetMethod](data);
  }

  pickData(dataflow: Dataflow) {
    if (typeof dataflow.dataDependencies !== 'undefined' && dataflow.dataDependencies.length > 0) {
      dataflow.dataDependencies.forEach((field: string) => {
        if (!(field in this.dataStore) || typeof this.dataStore[field] === 'undefined') {
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
    let flag = false;
    if (dataflow.skipWithout) {
      dataflow.skipWithout.forEach((key: string) => {
        if (!(key in this.dataStore) || typeof this.dataStore[key] === 'undefined') flag = true;
      });
    }
    if (dataflow.skipOn) {
      dataflow.skipOn.forEach((key: string) => {
        if (key in this.dataStore && typeof this.dataStore[key] !== 'undefined') flag = true;
      });
    }
    return flag;
  }

  validate(dataflow: Dataflow, data: any, resolve: any, reject: any) {
    const validator = dataflow.validator;
    if (typeof validator === 'undefined') return;
    const valid = validator.validate(data);
    if (!valid) reject(validator.getErrorResponse());
  }

  extractInitialDataDependencies() {
    // extract data from token if authDataDependencies is defined
    if (typeof this.dataflows[0].authDataDependencies !== 'undefined'
      && typeof this.dataflows[0].authDataDependencies.length === 'number'
      && this.dataflows[0].authDataDependencies.length > 0
    ) {
      const authorizerData = _.pick(this.tokenContents, this.dataflows[0].authDataDependencies);
      _.assign(this.initialData, authorizerData);
    }
    // prune data is dataDependencies is defined
    if (typeof this.dataflows[0].dataDependencies !== 'undefined'
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
  ) {
    const { storageSpecs } = thisDataflow;

    return promise
      .then((result: any) => {

        if (!this.shouldSkip(thisDataflow)) {
          // store output from thisDataflow to dataStore if storageSpecs is specified
          let output = this.transform(thisDataflow)(result);
          if (typeof storageSpecs !== 'undefined') {
            output = _.pick(output, storageSpecs);
            _.assign(this.dataStore, output);
          }
        }

        if (!this.shouldSkip(nextDataflow)) {
          // obtain data fields for nextDataflow
          const data = this.pickData(nextDataflow);
          // validate data fields
          this.validate(nextDataflow, data, resolve, reject);
          return this.getPromise(data, nextDataflow);
        }

        // return empty promise if skipped
        return new Promise((resolve: any) => resolve({}));
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
