import EndpointMaker from './../../../../models/EndpointMaker';
const handler = new EndpointMaker().make('updateProjectStatus');
export { handler };
