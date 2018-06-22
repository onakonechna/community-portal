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

interface DataFlow {
  validationMap: any;
  controller: string;
  method: string;
  methodMap: any;
  target: string; // resource (expand to include Github APIs in the future)
  targetType: string; // resource or webEndpoint
}

import Endpoint from './../Endpoint';

export default class ComponentIntegration {
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

  addDataFlow(dataFlow: DataFlow) {
    const controller = this.createController(dataFlow.controller, dataFlow.validationMap);
    let target: any;
    if (DataFlow.targetType === 'resource') {
      target = this.createResource();
    } else {
      throw 'error: only resource and webEndpoint types are allowed (webEndpoint type not implemented yet)';
    }

    // TODO

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

  // TODO

}
