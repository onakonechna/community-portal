import {Request, Response} from '../../../config/Types';
import IController from '../../api/IController';
import Project from '../model/Project';
import ProjectEntityFactory from '../entity/ProjectEntityFactory';

export default class Projects implements IController {
	private projectFactory;
	private project;

	constructor() {
		this.projectFactory = new ProjectEntityFactory();
		this.project = new Project();
	}

	public execute(req: Request, res: Response) {
		this.project.getProject(req.params.id)
			.then((projectEntity:any) => res.status(200).json({data: projectEntity.getData()}))
			.catch((err: any) => {
				console.log(err);
				res.status(200).json({
					error: true,
					message: 'Cannot get project'
				})
			});
	}
}