import PackageService from './../../../../src/services/PackageService';
import Endpoint from './../../../../src/Endpoint';

const packageService = new PackageService();
const endpoint = new Endpoint('/projects/', 'get');

const dataFlow = {
  controller: 'ProjectController',
  method: 'getProjectCards',
  target: 'ProjectResource',
  targetType: 'resource',
  methodMap: { getProjectCards: 'get' },
}

packageService.createEndpoint(endpoint);
packageService.addDataFlows([dataFlow]);
const handler = packageService.package();
export { handler };


// import EndpointMaker from './../../../../src/EndpointMaker';
// const handler = new EndpointMaker().make('getProjectCards');
// export { handler };
