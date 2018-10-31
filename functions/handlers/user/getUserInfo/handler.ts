import Endpoint from './../../../src/EndpointWrapper';
import { Request, Response } from "../../../config/Types";
import UserController from '../../../src/user/controller/User'

const getUserEndpoint = new Endpoint('/user/:id', 'get');

getUserEndpoint.configure((req: Request, res: Response) => {
	const userController = new UserController();

	userController.execute(req, res);
});

export const handler = getUserEndpoint.execute();
