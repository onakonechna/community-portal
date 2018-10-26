import {Request, Response} from '../../../config/Types';
import IController from '../IController';
import User from '../../../src/model/User';

export default class BookmarkProject implements IController {
	private user;

	constructor() {
		this.user = new User();
	}

	public execute(req: Request, res: Response) {
		this.user.getById(req.params.id)
			.then((userData:any) => res.status(200).json({data: userData.get()}))
			.catch((err: any) => {
				console.log(err);
				res.status(200).json({
					error: true,
					message: 'Cannot get user'
				})
			});
	}
}