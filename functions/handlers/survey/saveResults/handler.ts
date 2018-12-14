import Endpoint from './../../../src/EndpointWrapper';
import { Request, Response } from "../../../config/Types";
import SaveResultsController from '../../../src/survey/controller/saveResults'

const saveResultsEndpoint = new Endpoint('/survey/results/save', 'post');

saveResultsEndpoint.configure((req: Request, res: Response) => {
  const saveResultsController = new SaveResultsController();
    saveResultsController.execute(req, res);
});

export const handler = saveResultsEndpoint.execute();
