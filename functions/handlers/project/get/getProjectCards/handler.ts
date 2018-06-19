import EndpointMaker from './../../../../models/EndpointMaker';
const handler = new EndpointMaker().make('getProjectCards');
export { handler };
