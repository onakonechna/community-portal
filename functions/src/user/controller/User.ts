import {Request, Response} from '../../../config/Types';
import IController from '../../api/IController';
import User from '../model/User';
import IUserEntity from "../api/IUserEntity";

export default class BookmarkProject implements IController {
	private user;

	constructor() {
		this.user = new User();
	}

	public execute(req: Request, res: Response) {
		this.user.getById(req.params.id)
			.then((userEntity:IUserEntity) => res.status(200).json({data: userEntity.getSecureData()}))
			.catch((err: any) => {
				console.log(err);
				res.status(200).json({
					error: true,
					message: 'Cannot get user'
				})
			});
	}
}