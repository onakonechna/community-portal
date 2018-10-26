import UserResource from '../resource/User';
import ProjectResource from '../resource/Project';
import databaseConnection, { databaseTypes } from "../resources/DatabaseConnectionMariaDb";

export default class Project {
	private userResource;
	private connection;
	private projectResource;
	private projectData;

	constructor() {
		this.projectData = {};
		this.connection = databaseConnection.connect();
		this.userResource = UserResource(this.connection, databaseTypes);
		this.projectResource = ProjectResource(this.connection, databaseTypes);
		this.projectResource.associate(this.userResource);
	}

	public setData(data:any) {
		this.projectData = {...this.projectData, ...data};
	}

	public getData() {
		return this.projectData;
	}

	save():Promise<any> {
		const data = this.getData();

		return this.projectResource.find({where: {id: data.id}})
			.then((project:any) => project ? project.update(data).then(
				(projectResource:any) => projectResource.setOwner(data.ownerId)) :
				this.projectResource.create(
					{...data, ownerId: data.ownerId},
					{include: [{model: this.userResource, as: 'owner'}]}
				))
			.then(() => data.id);
	}

	public getById(id:number) {
		return this.projectResource.findById(id);
	}

	public getProject(id:number) {
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
		});
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
		})
	}

	public getListIds() {
		return this.projectResource.findAll({
			attributes: ['id']
		})
	}
}
