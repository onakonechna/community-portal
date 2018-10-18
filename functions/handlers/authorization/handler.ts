import { Request, Response } from '../../config/Types';
import Endpoint from '../../src/EndpointWrapper';
import AuthorizationController from '../../src/controller/Authorization';

const authorizationEndpoint = new Endpoint('/authorize', 'post');

authorizationEndpoint.configure((req: Request, res: Response) => {
	const authorizationController = new AuthorizationController();
	authorizationController.execute(req, res);
});

export const handler = authorizationEndpoint.execute();
