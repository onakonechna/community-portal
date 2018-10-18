import { Request, Response } from '../../config/Types';

export default interface IController {
	execute(req: Request, res: Response);
}