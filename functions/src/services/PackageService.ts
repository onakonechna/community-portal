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

interface DataFlowDefinition {
  controller: any; // class to instantiate from
  method: string;
  target: any; // class to instantiate from (resource for now)
  dataDependencies?: string[];
  validationMap?: any;
  methodMap?: any; // a map of methods on controller to methods on target
  storageSpecs?: string[]; // a list of output names to store to intermediary data store
}

interface DataFlow {
  dataDependencies: string[];
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
  private dataFlows: DataFlow[];
  private dataStore: any;
  private initialData: any;
  private tokenContents: any;
  private endpoint: Endpoint;

  constructor() {
    this.dataFlows = [];
    this.dataStore = {};

    this.executeDataFlows = this.executeDataFlows.bind(this);
  }

  createEndpoint(endpoint: Endpoint) {
    this.endpoint = endpoint;
  }

  addDataFlow(dataFlowDefinition: DataFlowDefinition) {
    const controller = this.createController(dataFlowDefinition.controller);
    const target = this.createResource(dataFlowDefinition.target);

    // by default, the targetMethod has the same name as the controllerMethod
    // if methodMap is not provided
    const controllerMethod = dataFlowDefinition.method;
    let targetMethod = controllerMethod;

    if (dataFlowDefinition.methodMap !== undefined) {
      if (dataFlowDefinition.methodMap[controllerMethod] === undefined) {
        throw 'The method map provided has no corresponding target method for the given controller method'
      }
      targetMethod = dataFlowDefinition.methodMap[controllerMethod];
    }

    // get dataDependencies
    const { dataDependencies } = dataFlowDefinition;

    // create validator
    let validator = undefined;
    if (dataFlowDefinition.validationMap !== undefined) {
      validator = new Validator(dataFlowDefinition.validationMap[controllerMethod]);
    }

    // get storageSpecs
    const { storageSpecs } = dataFlowDefinition;

    const dataFlow = {
      dataDependencies,
      controller,
      controllerMethod,
      validator,
      target,
      targetMethod,
      storageSpecs,
    }

    this.dataFlows.push(dataFlow);
  }

  addDataFlows(dataFlowDefinitions: DataFlowDefinition[]) {
    for (let i = 0; i < dataFlowDefinitions.length; i++) {
      this.addDataFlow(dataFlowDefinitions[i]);
    }
  }

  createController(Controller: any) {
    return new Controller();
  }

  createResource(Resource: any) {
    return new Resource(new DatabaseConnection());
  }

  executeDataFlows(resolve: any, reject: any) {
    if (this.initialData === undefined) {
      throw 'initialData has not been set yet';
    }
    if (this.dataFlows.length === 0) {
      throw 'No dataflow has been added';
    }

    this.validate(this.dataFlows[0], this.initialData, resolve, reject);

    // at this point, initial data only contains req.body or req.params
    // we check if dataDependencies for the first data flow is specified
    // and try to retrieve additional data from tokenContents if specified
    // note that initial data may be pruned if dataDependencies is a subset of initial data
    // and tokenContents data will overwrite initialData if the field name is not unique
    this.extractInitialDataDependencies();

    // store initialData in dataStore
    _.assign(this.dataStore, this.initialData);

    let chainedPromise = this.getPromise(this.initialData, this.dataFlows[0]);
    let thisDataFlow: DataFlow;
    let nextDataFlow: DataFlow;


    for (let i = 0; i < (this.dataFlows.length - 1); i++) {
      thisDataFlow = this.dataFlows[i];
      nextDataFlow = this.dataFlows[i+1];
      chainedPromise = this.chainPromise(chainedPromise, thisDataFlow, nextDataFlow, resolve, reject);
    }

    // handle last promise without chaining
    const lastDataFlow = this.dataFlows[this.dataFlows.length - 1];

    chainedPromise
      .then((result: any) => {
        resolve(this.transform(lastDataFlow)(result));
      })
      .catch((error: Error) => {
        reject(terminate(error));
      });
  }

  getPromise(data:any, dataFlow: DataFlow) {
    return dataFlow.target[dataFlow.targetMethod](data);
  }

  pickData(dataFlow: DataFlow) {
    if (dataFlow.dataDependencies !== undefined && dataFlow.dataDependencies.length > 0) {
      return _.pick(this.dataStore, dataFlow.dataDependencies);
    } else {
      return {};
    }
  }

  validate(dataFlow: DataFlow, data: any, resolve: any, reject: any) {
    const validator = dataFlow.validator;
    if (validator === undefined) return;
    const valid = validator.validate(data);
    if (!valid) reject(validator.getErrorResponse());
  }

  extractInitialDataDependencies() {
    if (this.dataFlows[0].dataDependencies !== undefined
      && typeof this.dataFlows[0].dataDependencies.length == 'number'
      && this.dataFlows[0].dataDependencies.length > 0
    ) {
      const prunedData = _.pick(this.initialData, this.dataFlows[0].dataDependencies);
      const authorizerData = _.pick(this.tokenContents, this.dataFlows[0].dataDependencies);
      this.initialData = _.assign(prunedData, authorizerData);
    }
  }

  chainPromise(promise: Promise<any>, thisDataFlow: DataFlow, nextDataFlow: DataFlow, resolve: any, reject: any, chained: boolean = true) {
    const { storageSpecs } = thisDataFlow;

    return promise
      .then((result: any) => {
        // store output from thisDataFlow to dataStore if storageSpecs is specified
        let output = this.transform(thisDataFlow)(result);
        if (storageSpecs !== undefined) {
          output = _.pick(output, storageSpecs);
          _.assign(this.dataStore, output);
        }

        // obtain data fields for nextDataFlow
        const data = this.pickData(nextDataFlow);
        // validate data fields
        this.validate(nextDataFlow, data, resolve, reject);
        return this.getPromise(data, nextDataFlow);

      })
  }

  // dataStore contains all data accumulated since the first dataFlows
  // we pass it to the controller method to get whatever data it needs
  transform(dataFlow: DataFlow){
    return dataFlow.controller[dataFlow.controllerMethod](this.dataStore);
  }

  package() {
    if (this.endpoint === undefined) {
      throw 'An endpoint must be specified';
    }
    this.endpoint.configure((req: Request, res: Response) => {
      this.initialData = _.assign(req.query, req.params, req.body);

      // append data from authorization context
      this.tokenContents = req.tokenContents;

      const dataFlowsPromise = new Promise(this.executeDataFlows);
      dataFlowsPromise
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
