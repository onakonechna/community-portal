import EndpointMaker from './../../../../models/EndpointMaker';
const handler = new EndpointMaker().make('createProject');
export { handler };
