import {Request, Response} from '../../../config/Types';
import IController from '../../api/IController';
import ProjectContributor from '../model/ProjectContributor';

export default class RemoveContributor implements IController {
	private projectContributor;

	constructor() {
		this.projectContributor = new ProjectContributor();
	}

	public execute(req: Request, res: Response) {
		this.projectContributor.remove(req.body.id, req.tokenContents.id)
			.then(() => res.status(200).json({id: req.body.id}))
			.catch((err: any) => {
				console.log(err);
				res.status(200).json({
					error: true,
					message: 'Cannot remove contributor'
				})
			});
	}
}