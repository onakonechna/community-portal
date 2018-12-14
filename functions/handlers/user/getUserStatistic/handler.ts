import Endpoint from './../../../src/EndpointWrapper';
import { Request, Response } from "../../../config/Types";
import StatisticController from '../../../src/user/controller/Statistic'

const getUserStatisticEndpoint = new Endpoint('/user/statistic/:id', 'get');

getUserStatisticEndpoint.configure((req: Request, res: Response) => {
	const statisticController = new StatisticController();

	statisticController.execute(req, res);
});

export const handler = getUserStatisticEndpoint.execute();
