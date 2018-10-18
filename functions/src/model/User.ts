import UserResource from '../resource/User';
import ProjectResource from '../resource/Project';
import databaseConnection, { databaseTypes } from "../resources/DatabaseConnectionMariaDb";

export default class User {
	private userResource;
	private userData;
	private starredProjects;
	private connection;
	private projectResource;

	constructor() {
		this.userData = {};

		this.connection = databaseConnection.connect();
		this.projectResource = ProjectResource(this.connection, databaseTypes);
		this.userResource = UserResource(this.connection, databaseTypes);
		this.userResource.associate(this.projectResource);
	}

	public setData(data:any) {
		this.userData = {...this.userData, ...data};
	}

	public getData() {
		return this.userData;
	}

	public setStarredProjects(data:number[]) {
		this.starredProjects = data;
	}

	public getStarredProjects() {
		return this.starredProjects;
	}

	public hasStarredProjects() {
		return !!this.starredProjects;
	}

	getById(id:number) {
		return this.userResource.findById(id);
	}

	getTokenById(id:number) {
		return this.userResource.findById(id, {
			attributes: ['access_token']
		}).then((user:any) => user.get().access_token);
	}

	save():Promise<any> {
		return this.userResource.find({
			where: {id: this.getData().id},
			include: [{
				model: this.projectResource,
				as: 'stars',
			}],
		})
			.then((user:any) => user ? user.update(this.getData()) : this.userResource.create(this.getData()))
			.then((userResource:any) => {
				if (this.hasStarredProjects()) {
					return userResource.setStars(this.getStarredProjects());
				}
			})
			.then(() => this.getData().id);
	}
}
