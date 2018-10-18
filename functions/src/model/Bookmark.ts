import UserResource from '../resource/User';
import ProjectResource from '../resource/Project';
import databaseConnection, { databaseTypes } from "../resources/DatabaseConnectionMariaDb";

export default class Project {
	private connection;
	private projectResource;
	private userResource;

	constructor() {
		this.connection = databaseConnection.connect();
		this.userResource = UserResource(this.connection, databaseTypes);
		this.projectResource = ProjectResource(this.connection, databaseTypes);
		this.userResource.associate(this.projectResource);
	}

	public add(project_id:number, user_id:number) {
		return this.userResource.build({id: user_id}).addBookmarkedProjects(project_id)
	}

	public remove(project_id:number, user_id:number) {
		return this.userResource.build({id: user_id}).removeBookmarkedProjects(project_id)
	}
}
