import {Request, Response} from '../../../config/Types';
import IController from '../IController';
import Project from '../../../src/model/Project';
import ProjectEntityFactory from '../../../src/entity/ProjectEntityFactory';

export default class Projects implements IController {
	private projectFactory;
	private project;

	constructor() {
		this.projectFactory = new ProjectEntityFactory();
		this.project = new Project();
	}

	public execute(req: Request, res: Response) {
		this.project.getProject(req.params.id)
			.then((project:any) => res.status(200).json({data: project.get()}))
			.catch((err: any) => {
				console.log(err);
				res.status(200).json({
					error: true,
					message: 'Cannot get project'
				})
			});
	}
}