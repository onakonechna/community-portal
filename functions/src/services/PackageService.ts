// package(controller: any) {
//   const methods = getMethods(controller);
//   for (let i=0; i < methods.length; i++) {
//     let method = methods[i];
//     controller[method] = this.process(method);
//   }
// }
//
// process(promise: Promise<any>) {
//
// }

import * as path from 'path';

import DatabaseConnection from './../resources/DatabaseConnection';

interface DataFlowDefinition {
  validationMap: any;
  controller: string;
  method: string;
  methodMap: any;
  target: string; // resource (expand to include Github APIs in the future)
  targetType: string; // resource or webEndpoint
}

interface DataFlow {
  controller: any;
  controllerMethod: string;
  target: any; // resource (expand to include Github APIs in the future)
  targetMethod: string; // resource or webEndpoint
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

  // set the relatve path to the config files
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
    const controller = this.createController(dataFlowDefinition.controller, dataFlowDefinition.validationMap);
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

    const dataFlow = {
      controller,
      controllerMethod,
      target,
      targetMethod,
    }

    this.dataFlows.push(dataFlow);
  }

  createController(controller: string, validationMap: any) {
    let controllerPath = this.controllerMap[controller];
    if (this.hasOwnProperty('controllerMapRoot')){
      controllerPath = path.join(this.controllerMapRoot, controllerPath);
    }
    const Controller = require(controllerPath);
    return new Controller(validationMap);
  }

  createResource(resource: string) {
    let resourcePath = this.resourceMap[resource];
    if (this.hasOwnProperty('resourceMapRoot')){
      resourcePath = path.join(this.resourceMapRoot, resourcePath);
    }
    const Resource = require(resourcePath);
    return new Controller(new DatabaseConnection());
  }

  integrate() {
    if (this.dataFlows.length === 0) {
      throw 'No dataflow has been added';
    }
    if (this.endpoint === undefined) {
      throw 'An endpoint must be specified';
    }
    for (let i = 0; i < (this.dataFlows.length - 1); i++) {

    }
  }

}
