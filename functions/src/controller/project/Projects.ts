import {Request, Response} from '../../../config/Types';
import IController from '../IController';
import Project from '../../../src/model/Project';
import ProjectStars from '../../../src/model/ProjectStar';
import Github from '../../../src/resource/Github';
import ProjectEntityFactory from '../../../src/entity/ProjectEntityFactory';

export default class Projects implements IController {
	private projectFactory;
	private project;
	private projectCollection;
	private projectStars;
	private githubResource;

	constructor() {
		this.projectFactory = new ProjectEntityFactory();
		this.project = new Project();
		this.projectStars = new ProjectStars();
		this.githubResource = new Github();
	}

	public execute(req: Request, res: Response) {
		this.project.getList()
			.then((projects:any) => this.generateProjectCollection(projects))
			.then(() => this.getProjectStargazersQuantity(this.projectCollection))
			.then((updatedProjects:object[]) => this.projectStars.updateList(updatedProjects))
			.then(() => res.status(200).json({data: this.getProjectCollectionData()}))
			.catch((err: any) => console.log(err) || res.status(200).json({
				error: true,
				message: 'Cannot get projects'
			}));
	}

	private getProjectCollectionData() {
		return this.projectCollection.map((projectEntity:any) => projectEntity.getData())
	}

	private generateProjectCollection(projects:any) {
		return this.projectCollection = projects.map((data:any) => this.projectFactory.create(data.get()));
	}

	private getProjectStargazersQuantity(projectCollection:any) {
		return Promise.all(projectCollection.map((projectEntity:any) => {
			return this.githubResource.getRepository(projectEntity.getOrganizationName(), projectEntity.getRepositoryName())
				.then((repository:any) => ({id: projectEntity.getId(), stargazers_count: repository['stargazers_count']}))
		}));
	}
}