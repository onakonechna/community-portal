import * as _ from 'lodash';
import * as path from 'path';
import * as express from 'express';
import * as fs from 'fs';

import DatabaseConnection from './../resources/DatabaseConnection';
import Endpoint from './../Endpoint';
import Validator from './../Validator';

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

interface DataFlowDefinition {
  controller: string; // compulsory
  method: string; // compulsory
  target: string; // compulsory: resource (expand to include Github APIs in the future)
  targetType: string; // compulsory: resource or webEndpoint
  dataDependencies?: string[]; // optional
  validationMap?: any; // optional
  methodMap?: any; // optional: a map of methods on controller to methods on target
}

interface DataFlow {
  dataDependencies: string[];
  controller: any;
  controllerMethod: string;
  validator: Validator;
  target: any;
  targetMethod: string;
}

export default class PackageService {
  private controllerMap: any;
  private resourceMap: any;
  private webEndpointMap: any; // for Github APIs later on
  private dataFlows: DataFlow[];
  private dataStore: any;
  private initialData: any;
  private endpoint: Endpoint;

  constructor(controllerMap?: any, resourceMap?: any, webEndpointMap?: any) {
    if (controllerMap !== undefined) {
      this.controllerMap = controllerMap;
    } else {
      this.controllerMap = JSON.parse(fs.readFileSync('config/controllerMap.json', 'utf8'));
    }
    if (resourceMap !== undefined) {
      this.resourceMap = resourceMap;
    } else {
      this.resourceMap = JSON.parse(fs.readFileSync('config/resourceMap.json', 'utf8'));
    }
    this.webEndpointMap = webEndpointMap;
    this.dataFlows = [];
    this.dataStore = {};

    this.executeDataFlows = this.executeDataFlows.bind(this);
  }

  createEndpoint(endpoint: Endpoint) {
    this.endpoint = endpoint;
  }

  async addDataFlow(dataFlowDefinition: DataFlowDefinition) {
    // create controller via asynchronous import
    const controller = await this.createController(dataFlowDefinition.controller);

    // create resource via asynchronous import
    let target: any;
    if (dataFlowDefinition.targetType === 'resource') {
      target = await this.createResource(dataFlowDefinition.target);
    } else {
      throw 'error: only resource and webEndpoint types are allowed (webEndpoint type not implemented yet)';
    }

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

    const dataFlow = {
      dataDependencies,
      controller,
      controllerMethod,
      validator,
      target,
      targetMethod,
    }

    this.dataFlows.push(dataFlow);
  }

  async addDataFlows(dataFlowDefinitions: DataFlowDefinition[]) {
    for (let i = 0; i < dataFlowDefinitions.length; i++) {
      await this.addDataFlow(dataFlowDefinitions[i]);
    }
  }

  async createController(controller: string) {
    let controllerPath = this.controllerMap[controller];
    const Controller = await import(`./../../${controllerPath}.ts`);
    return new Controller.default();
  }

  async createResource(resource: string) {
    let resourcePath = this.resourceMap[resource];
    const Resource = await import(`./../../${resourcePath}.ts`);
    return new Resource.default(new DatabaseConnection());
  }

  executeDataFlows(resolve: any, reject: any) {
    if (this.initialData === undefined) {
      throw 'initialData has not been set yet';
    }
    if (this.dataFlows.length === 0) {
      throw 'No dataflow has been added';
    }

    console.log('1');

    this.validate(this.dataFlows[0], this.initialData, resolve, reject);

    console.log('2');

    // store initialData in dataStore
    _.assign(this.dataStore, this.initialData);

    console.log('3');

    let chainedPromise = this.getPromise(this.initialData, this.dataFlows[0]);
    console.log('4');
    let thisDataFlow: DataFlow;
    let nextDataFlow: DataFlow;


    for (let i = 0; i < (this.dataFlows.length - 1); i++) {
      thisDataFlow = this.dataFlows[i];
      nextDataFlow = this.dataFlows[i+1];
      chainedPromise = this.chainPromise(chainedPromise, thisDataFlow, nextDataFlow, resolve, reject);
    }

    console.log('5');

    // handle last promise without chaining
    const lastDataFlow = this.dataFlows[this.dataFlows.length - 1];
    const { transform, terminate } = lastDataFlow.controller[lastDataFlow.controllerMethod]();
    chainedPromise
      .then((result: any) => {
        resolve(transform(result));
      })
      .catch((error: Error) => {
        reject(terminate(error));
      });

    console.log('6');
  }

  getPromise(data:any, dataFlow: DataFlow) {
    console.log(data);
    console.log(dataFlow.targetMethod);
    console.log(dataFlow.target);
    console.log('====================');
    console.log(dataFlow.target.get);
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

  chainPromise(promise: Promise<any>, thisDataFlow: DataFlow, nextDataFlow: DataFlow, resolve: any, reject: any, chained: boolean = true) {
    // dataStore contains all data accumulated since the first dataFlows
    // we pass it to the controller method to get whatever data it needs
    const { transform, terminate } = thisDataFlow.controller[thisDataFlow.controllerMethod](this.dataStore);

    return promise
      .then((result: any) => {
        // store output from thisDataFlow to dataStore
        const output = transform(result);
        _.assign(this.dataStore, output);

        // obtain data fields for nextDataFlow
        const data = this.pickData(nextDataFlow);
        // validate data fields
        this.validate(nextDataFlow, data, resolve, reject);
        return this.getPromise(data, nextDataFlow);

      })
      .catch((error: Error) => {
        reject(terminate(error));
      });
  }

  package() {
    if (this.endpoint === undefined) {
      throw 'An endpoint must be specified';
    }
    this.endpoint.configure((req: express.Request, res: express.Response) => {
      if (this.endpoint.getMethod() === 'get') {
        this.initialData = req.params;
      } else {
        this.initialData = req.body;
      }
      const dataFlowsPromise = new Promise(this.executeDataFlows);
      dataFlowsPromise
        .then(({ status, payload }) => {
          console.log('hi');
          res.status(status).json(payload);
        })
        .catch(({ status, payload }) => {
          console.log(status);
          console.log(payload);
          res.status(status).json(payload);
        });
    });
    return this.endpoint.wrap();
  }

}
