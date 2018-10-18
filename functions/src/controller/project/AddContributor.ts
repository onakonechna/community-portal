import {Request, Response} from '../../../config/Types';
import IController from '../IController';
import ProjectContributor from '../../../src/model/ProjectContributor';

export default class AddContributor implements IController {
	private projectContributor;

	constructor() {
		this.projectContributor = new ProjectContributor();
	}

	public execute(req: Request, res: Response) {
		this.projectContributor.add(req.body.id, req.tokenContents.id)
			.then(() => res.status(200).json({id: req.body.id}))
			.catch((err: any) => {
				console.log(err);
				res.status(200).json({
					error: true,
					message: 'Cannot add contributor'
				})
			});
	}
}