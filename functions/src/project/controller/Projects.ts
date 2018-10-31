import {Request, Response} from '../../../config/Types';
import IController from '../../api/IController';
import Project from '../model/Project';
import ProjectStars from '../model/ProjectStar';
import Github from '../../services/Github';
import ProjectEntityFactory from '../entity/ProjectEntityFactory';
import IProjectEntity from "../api/IProjectEntity";

export default class Projects implements IController {
	private projectFactory;
	private project;
	private projectStars;
	private githubResource;
	private projectEntities;

	constructor() {
		this.projectFactory = new ProjectEntityFactory();
		this.project = new Project();
		this.projectStars = new ProjectStars();
		this.githubResource = new Github();
	}

	public execute(req: Request, res: Response) {
		this.project.getList()
			.then((projectEntities:IProjectEntity[]) => this.projectEntities = projectEntities)
			.then(() => this.getProjectStargazersQuantity(this.projectEntities))
			.then((updatedProjects:object[]) => this.projectStars.updateList(updatedProjects))
			.then(() => res.status(200).json({data: this.getProjectCollectionData()}))
			.catch((err: any) => {
				console.log(err);
				res.status(200).json({
					error: true,
					message: 'Cannot get projects'
				})
			});
	}

	private getProjectCollectionData() {
		return this.projectEntities.map((projectEntity:any) => projectEntity.getData())
	}

	private getProjectStargazersQuantity(projectCollection:any) {
		return Promise.all(projectCollection.map((projectEntity:any) => {
			return this.githubResource.getRepository(projectEntity.getOrganizationName(), projectEntity.getRepositoryName())
				.then((repository:any) => ({id: projectEntity.getId(), stargazers_count: repository['stargazers_count']}))
		}));
	}
}