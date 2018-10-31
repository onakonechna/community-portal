import {Request, Response} from '../../../config/Types';
import IController from '../../api/IController';
import Github from '../../services/Github';
import Project from '../model/Project';
import ProjectEntityFactory from '../entity/ProjectEntityFactory';

export default class Save implements IController {
	private githubResource;
	private projectFactory;
	private projectEntity;
	private project;

	constructor() {
		this.projectFactory = new ProjectEntityFactory();
		this.githubResource = new Github();
		this.project = new Project();
	}

	public execute(req: Request, res: Response) {
		this.projectEntity = this.projectFactory.create({...req.body, ownerId: req.tokenContents.id});
		this.githubResource.getRepository(this.projectEntity.getOrganizationName(), this.projectEntity.getRepositoryName())
			.then(({id, stargazers_count}) => {
				this.projectEntity.set({id, stargazers_count});
				return this.project.save(this.projectEntity);
			})
			.then(() => res.status(200).json({data: this.projectEntity.getId()}))
			.catch((err: any) => {
				console.log(err);
				res.status(200).json({
					error: true,
					message: 'Project creating is failed'
				})
			});
	}
}