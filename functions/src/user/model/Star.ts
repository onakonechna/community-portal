import UserResource from '../resource/User';
import ProjectResource from '../../project/resource/Project';
import databaseConnection, { databaseTypes } from "../../DatabaseConnectionMariaDb";

export default class Project {
	private connection;
	private projectResource;
	private userResource;

	constructor() {
		this.connection = databaseConnection.connect();
		this.userResource = UserResource(this.connection, databaseTypes);
		this.projectResource = ProjectResource(this.connection, databaseTypes);
		this.projectResource.associate(this.userResource);
	}

	public add(project_id:number, user_id:number) {
		return this.projectResource.build({id: project_id}).addStar(user_id);
	}

	public remove(project_id:number, user_id:number) {
		return this.projectResource.build({id: project_id}).removeStar(user_id);
	}

	public updateList(list:any) {
		this.projectResource.bulkCreate(list, { updateOnDuplicate: ['stargazers_count'] })
	}
}
