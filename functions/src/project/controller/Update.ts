import {Request, Response} from '../../../config/Types';
import IController from '../../api/IController';
import Project from '../model/Project';
import ProjectEntityFactory from '../entity/ProjectEntityFactory';

export default class Save implements IController {
	private projectFactory;
	private projectEntity;
	private project;

	constructor() {
		this.projectFactory = new ProjectEntityFactory();
		this.project = new Project();
	}

	public execute(req: Request, res: Response) {
		this.projectEntity = this.projectFactory.create(req.body);
		this.project.save(this.projectEntity)
			.then(() => res.status(200).json({data: this.projectEntity.getId()}))
			.catch((err: any) => {
				console.log(err);
				res.status(200).json({
					error: true,
					message: 'Cannot update project'
				})
			});
	}
}