import Endpoint from './../../../src/EndpointWrapper';
import { Request, Response } from "../../../config/Types";
import UnboookmarkProjectController from '../../../src/user/controller/UnbookmarkProject'

const unbookmarkProjectEndpoint = new Endpoint('/user/bookmarkProject', 'delete');

unbookmarkProjectEndpoint.configure((req: Request, res: Response) => {
	const unboookmarkProjectController = new UnboookmarkProjectController();
	unboookmarkProjectController.execute(req, res);
});

export const handler = unbookmarkProjectEndpoint.execute();
