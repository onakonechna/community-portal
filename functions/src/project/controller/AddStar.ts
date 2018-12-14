import {Request, Response} from '../../../config/Types';
import IController from '../../api/IController';
import ProjectStar from '../model/ProjectStar';
import User from '../../user/model/User';
import ProjectEntityFactory from "../entity/ProjectEntityFactory";
import Project from "../model/Project";
import Github from '../../services/Github';

export default class AddStar implements IController {
	private projectFactory;
	private projectEntity;
	private projectStar;
	private project;
	private user;
	private githubResource;

	constructor() {
		this.projectFactory = new ProjectEntityFactory();
		this.projectStar = new ProjectStar();
		this.project = new Project();
		this.user = new User();
		this.githubResource = new Github();
	}

	public execute(req: Request, res: Response) {
		Promise.all([
			this.user.getTokenById(req.tokenContents.id),
			this.project.getById(req.body.id)
		])
			.then(([token, projectEntity]) => {
				this.projectEntity = projectEntity;

				return Promise.all([
					this.projectStar.add(this.projectEntity.getId(), req.tokenContents.id),
					this.githubResource.addStar(
						this.projectEntity.getOrganizationName(),
						this.projectEntity.getRepositoryName(),
						token
					)
				])
			})
			.then(() => res.status(200).json({id: this.projectEntity.getId()}))
			.catch((err: any) => {
				console.log(err);
				res.status(200).json({error: true, message: 'Cannot add star'});
			});
	}
}