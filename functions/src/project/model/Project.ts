import UserResource from '../../user/resource/User';
import ProjectResource from '../resource/Project';
import databaseConnection, { databaseTypes } from "../../DatabaseConnectionMariaDb";
import IProjectEntity from "../api/IProjectEntity";
import ProjectEntityFactory from '../entity/ProjectEntityFactory';


export default class Project {
	private userResource;
	private connection;
	private projectEntityFactory;
	private projectResource;

	constructor() {
		this.connection = databaseConnection.connect();
		this.userResource = UserResource(this.connection, databaseTypes);
		this.projectResource = ProjectResource(this.connection, databaseTypes);
		this.projectEntityFactory = new ProjectEntityFactory();
		this.projectResource.associateUser(this.userResource);
	}

	save(projectEntity:IProjectEntity):Promise<number> {
		return this.projectResource.find({where: {id: projectEntity.getId()}})
			.then((project:any) => project ? project.update(projectEntity.getData()).then(
				(projectResource:any) => projectResource.setOwner(projectEntity.getOwnerId())) :
				this.projectResource.create(projectEntity.getData(), {include: [{model: this.userResource, as: 'owner'}]}))
			.then(() => projectEntity.getId());
	}

	public getById(id:number):Promise<IProjectEntity> {
		return this.projectResource.findById(id)
			.then((projectResource) => this.projectEntityFactory.create(projectResource.get()));
	}

	public getProject(id:number):Promise<IProjectEntity> {
		return this.projectResource.findById(id, {
			include: [{
				model: this.userResource,
				as: 'bookmarked',
				attributes: ['id']
			}, {
				model: this.userResource,
				as: 'contributors',
				attributes: ['name', 'login', 'id', 'avatar_url', 'url', 'location', 'company']
			}]
		}).then((projectResource) => this.projectEntityFactory.create(projectResource.get()));
	}

	public getList() {
		return this.projectResource.findAll({
			include: [{
				model: this.userResource,
				as: 'bookmarked',
				attributes: ['id']
			}, {
				model: this.userResource,
				as: 'contributors',
				attributes: ['name', 'login', 'id', 'avatar_url', 'url', 'location', 'company']
			}]
		}).then((collections) =>
			collections.map((projectResource) => this.projectEntityFactory.create(projectResource.get())))
	}

	public getListIds() {
		return this.projectResource.findAll({
			attributes: ['id']
		})
	}
}
