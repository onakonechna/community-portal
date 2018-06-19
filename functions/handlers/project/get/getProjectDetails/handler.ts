import EndpointMaker from './../../../../models/EndpointMaker';
const handler = new EndpointMaker().make('getProjectDetails');
export { handler };
