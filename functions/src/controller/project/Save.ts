import {Request, Response} from '../../../config/Types';
import IController from '../IController';
import Github from '../../../src/resource/Github';
import Project from '../../../src/model/Project';
import ProjectEntityFactory from '../../../src/entity/ProjectEntityFactory';

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
				this.project.setData(this.projectEntity.getExistingData());

				return this.project.save();
			})
			.then(() => res.status(200).json({data: this.project.getData().id}))
			.catch((err: any) => console.log(err) || res.status(200).json({
				error: true,
				message: 'Project creating is failed'
			}));
	}
}