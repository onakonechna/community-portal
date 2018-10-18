import ProjectResource from '../resource/Project';
import UserResource from '../resource/User';
import databaseConnection, { databaseTypes } from "../resources/DatabaseConnectionMariaDb";

export default class Project {
	private connection;
	private userResource;
	private projectResource;

	constructor() {
		this.connection = databaseConnection.connect();
		this.projectResource = ProjectResource(this.connection, databaseTypes);
		this.userResource = UserResource(this.connection, databaseTypes);
		this.projectResource.associate(this.userResource);
	}

	public add(project_id:number, user_id:number) {
		return this.projectResource.build({id: project_id}).addContributor(user_id);
	}

	public remove(project_id:number, user_id:number) {
		return this.projectResource.build({id: project_id}).removeContributor(user_id);
	}
}
