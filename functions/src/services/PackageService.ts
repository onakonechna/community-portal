import * as _ from 'lodash';
import * as path from 'path';

import DatabaseConnection from './../resources/DatabaseConnection';
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
  dataDependencies: string[]; // optional
  validationMap: any; // optional
  methodMap: any; // optional: a map of methods on controller to methods on target
}

interface DataFlow {
  dataDependencies: string[];
  controller: any;
  controllerMethod: string;
  validator: Validator;
  target: any;
  targetMethod: string;
}

import Endpoint from './../Endpoint';

export default class PackageService {
  private controllerMap: any;
  private controllerMapRoot: string;
  private resourceMap: any;
  private resourceMapRoot: string;
  private webEndpointMap: any; // for Github APIs later on
  private webEndpointMapRoot: string;
  private dataFlows: DataFlow[];
  private dataStore: any;
  private initialData: any;

  constructor(controllerMap: any, resourceMap: any, webEndpointMap: any) {
    this.controllerMap = controllerMap;
    this.resourceMap = resourceMap;
    this.webEndpointMap = webEndpointMap;
    this.dataFlows = [];
    this.dataStore = {};
  }

  createEndpoint(endpoint: Endpoint) {
    this.endpoint = endpoint;
  }

  // set the relative path to the config files
  // file paths to the objects in the maps will be resolved relative to the root
  setControllerMapPath(configPath: string) {
    this.controllerMapRoot = configPath;
  }

  setResourceMapPath(configPath: string) {
    this.resourceMapRoot = configPath;
  }

  setWebEndpointMapPath(configPath: string) {
    this.webEndpointMapRoot = configPath;
  }

  addDataFlow(dataFlowDefinition: DataFlowDefinition) {
    const controller = this.createController(dataFlowDefinition.controller);
    let target: any;
    if (dataFlowDefinition.targetType === 'resource') {
      target = this.createResource();
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

    const { dataDependencies } = DataFlowDefinition;
    const validator = new Validator(dataFlowDefinition.validationMap[controllerMethod]);

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

  createController(controller: string) {
    let controllerPath = this.controllerMap[controller];
    if (this.hasOwnProperty('controllerMapRoot')){
      controllerPath = path.join(this.controllerMapRoot, controllerPath);
    }
    const Controller = require(controllerPath);
    return new Controller();
  }

  createResource(resource: string) {
    let resourcePath = this.resourceMap[resource];
    if (this.hasOwnProperty('resourceMapRoot')){
      resourcePath = path.join(this.resourceMapRoot, resourcePath);
    }
    const Resource = require(resourcePath);
    return new Controller(new DatabaseConnection());
  }

  executeDataFlows(resolve: any, reject: any) {
    if (this.initialData === undefined) {
      throw 'initialData has not been set yet';
    }
    if (this.dataFlows.length === 0) {
      throw 'No dataflow has been added';
    }

    const validator = this.dataFlows[0].validator;
    const valid = validator.validate(initialData);
    if (!valid) reject(validator.getErrorResponse());

    // store initialData in dataStore
    _.assign(self.dataStore, initialData)

    let chainedPromise = this.getPromise(initialData, this.dataFlows[0]);
    let nextDataFlow: DataFlow;
    for (let i = 0; i < (this.dataFlows.length - 1); i++) {
      nextDataFlow = this.dataFlows[i+1];
      chainedPromise = this.chainPromise(chainedPromise, nextDataFlow, resolve, reject);
    }

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
  }

  getPromise(data:any, dataFlow: DataFlow) {
    return dataFlow.target[dataFlow.targetMethod](data);
  }

  pickData(dataFlow: DataFlow) {
    if (dataFlow.dataDependencies !== undefined && dataFlow.dataDependencies.length > 0) {
      return _.pick(self.dataStore, dataFlow.dataDependencies);
    } else {
      return {};
    }
  }

  validate(dataFlow: DataFlow, data: any, resolve: any, reject: any) {
    const validator = dataFlow.validator;
    const valid = validator.validate(data);
    if (!valid) reject(validator.getErrorResponse());
  }

  chainPromise(promise: Promise<any>, nextDataFlow: DataFlow, resolve: any, reject: any, chained: boolean = true) {
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
      if (this.endpoint.method === 'get') {
        this.initialData = req.params;
      } else {
        this.initialData = req.body;
      }
      const dataFlowsPromise = new Promise(executeDataFlows);
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
