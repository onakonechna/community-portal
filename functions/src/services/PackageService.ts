import * as _ from 'lodash';
import * as path from 'path';
import * as fs from 'fs';

import { Request, Response } from './../../config/types';

import DatabaseConnection from './../resources/DatabaseConnection';
import Endpoint from './../Endpoint';
import Validator from './../Validator';

const terminate = (error: Error) => {
  return {
    status: 400,
    payload: { error },
  }
};

// dataDependencies:
// a list of retrieved data fields returned by
// the resolve function for each controller method in previous data flow(s)
// used to feed intermediary data from previous data flow(s)
// into the current data flow
// you can ignore dataDependencies if the current data flow does not depend on any
// previously retrieved data
// (the intermediary data fields are stored in this.dataStore)
// (make sure that they do not overwrite each other)
// (check the naming in the object returned by resolve for each controller method)

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
}

export default class PackageService {
  private controllerMap: any;
  private resourceMap: any;
  private webEndpointMap: any; // for Github APIs later on
  private dataflows: Dataflow[];
  private dataStore: any;
  private initialData: any;
  private tokenContents: any;
  private endpoint: Endpoint;

  constructor(endpoint: Endpoint, dataflows: DataflowDefinition[]) {
    this.dataflows = [];
    this.dataStore = {};

    this.endpoint = endpoint;
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

    // by default, the targetMethod has the same name as the controllerMethod
    // if methodMap is not provided
    const controllerMethod = dataflowDefinition.method;
    let targetMethod = controllerMethod;

    if (dataflowDefinition.methodMap !== undefined) {
      if (dataflowDefinition.methodMap[controllerMethod] === undefined) {
        throw 'The method map provided has no corresponding target method for the given controller method'
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
    const { storageSpecs } = dataflowDefinition;

    const dataflow = {
      dataDependencies,
      authDataDependencies,
      controller,
      controllerMethod,
      validator,
      target,
      targetMethod,
      storageSpecs,
    }

    this.dataflows.push(dataflow);
  }

  addDataflows(dataflowDefinitions: DataflowDefinition[]) {
    for (let i = 0; i < dataflowDefinitions.length; i++) {
      this.addDataflow(dataflowDefinitions[i]);
    }
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
    if (this.initialData === undefined) {
      throw 'initialData has not been set yet';
    }
    if (this.dataflows.length === 0) {
      throw 'No dataflow has been added';
    }

    this.validate(this.dataflows[0], this.initialData, resolve, reject);

    // at this point, initial data only contains req.body or req.params
    // we check if dataDependencies for the first data flow is specified
    // and try to retrieve additional data from tokenContents if specified
    // note that initial data may be pruned if dataDependencies is a subset of initial data
    // and tokenContents data will overwrite initialData if the field name is not unique
    this.extractInitialDataDependencies();

    // store initialData in dataStore
    _.assign(this.dataStore, this.initialData);

    let chainedPromise = this.getPromise(this.initialData, this.dataflows[0]);
    let thisDataflow: Dataflow;
    let nextDataflow: Dataflow;


    for (let i = 0; i < (this.dataflows.length - 1); i++) {
      thisDataflow = this.dataflows[i];
      nextDataflow = this.dataflows[i+1];
      chainedPromise = this.chainPromise(chainedPromise, thisDataflow, nextDataflow, resolve, reject);
    }

    // handle last promise without chaining
    const lastDataflow = this.dataflows[this.dataflows.length - 1];

    chainedPromise
      .then((result: any) => {
        resolve(this.transform(lastDataflow)(result));
      })
      .catch((error: Error) => {
        reject(terminate(error));
      });
  }

  getPromise(data: any, dataflow: Dataflow) {
    return dataflow.target[dataflow.targetMethod](data);
  }

  pickData(dataflow: Dataflow) {
    if (dataflow.dataDependencies !== undefined && dataflow.dataDependencies.length > 0) {
      dataflow.dataDependencies.forEach((field: string) => {
        if (!(field in this.dataStore)) {
          console.log('Logging intermediate data store between data flows..');
          console.log(this.dataStore);
          throw `PackageService Error: ${field} is expected but cannot be found in the data store`
        }
      });
      return _.pick(this.dataStore, dataflow.dataDependencies);
    } else {
      return Object.assign({}, this.dataStore);
    }
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
      && typeof this.dataflows[0].authDataDependencies.length == 'number'
      && this.dataflows[0].authDataDependencies.length > 0
    ) {
      const authorizerData = _.pick(this.tokenContents, this.dataflows[0].authDataDependencies);
      _.assign(this.initialData, authorizerData);
    }
    // prune data is dataDependencies is defined
    if (this.dataflows[0].dataDependencies !== undefined
      && typeof this.dataflows[0].dataDependencies.length == 'number'
      && this.dataflows[0].dataDependencies.length > 0
    ) {
      this.initialData = _.pick(this.initialData, this.dataflows[0].dataDependencies);
    }
  }

  chainPromise(promise: Promise<any>, thisDataflow: Dataflow, nextDataflow: Dataflow, resolve: any, reject: any, chained: boolean = true) {
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

      })
  }

  // dataStore contains all data accumulated since the first dataflows
  // we pass it to the controller method to get whatever data it needs
  transform(dataflow: Dataflow){
    return dataflow.controller[dataflow.controllerMethod](this.dataStore);
  }

  package() {
    this.endpoint.configure((req: Request, res: Response) => {
      this.initialData = _.assign(req.query, req.params, req.body);

      // append data from authorization context
      this.tokenContents = req.tokenContents;

      const dataflowsPromise = new Promise(this.executeDataflows);
      dataflowsPromise
        .then(({ status, payload }) => {
          res.status(status).json(payload);
        })
        .catch(({ status, payload }) => {
          res.status(status).json(payload);
        });
    });
    return this.endpoint.wrap();
  }

}
