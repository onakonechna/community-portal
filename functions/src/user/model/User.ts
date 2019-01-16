import UserResource from '../resource/User';
import ProjectResource from '../../project/resource/Project';
import ScopeResource from '../../scope/resource/Scope';
import databaseConnection, { databaseTypes } from "../../DatabaseConnectionMariaDb";
import IUserEntity from '../api/IUserEntity';
import UserFactory from '../entity/UserFactory';

export default class User {
	private userFactory;
	private userResource;
	private connection;
	private projectResource;
	private scopeResource;

	constructor() {
		this.connection = databaseConnection.connect();
		this.userFactory = new UserFactory();
		this.userResource = UserResource(this.connection, databaseTypes);
		this.scopeResource = ScopeResource(this.connection, databaseTypes);
		this.projectResource = ProjectResource(this.connection, databaseTypes);

		this.userResource.associateProject(this.projectResource);
		this.userResource.associateScopes(this.scopeResource);
	}

	getById(id:number):Promise<IUserEntity> {
		return this.userResource.findById(id, {
			include: [{
				model: this.scopeResource,
				as: 'scopes',
				attributes: ['scope', 'id']
			}]
		}).then((resource:any) => this.userFactory.create(resource.get()))
	}

	getByLogin(login:string):Promise<IUserEntity> {
		return this.userResource.findOne({
			where: {login: login},
			include: [{
				model: this.scopeResource,
				as: 'scopes',
				attributes: ['scope', 'id']
			}]
		}).then((resource:any) => this.userFactory.create(resource.get()))
	}

	getTokenById(id:number):Promise<string> {
		return this.userResource.findById(id, {
			attributes: ['access_token']
		}).then((user:any) => user.get().access_token);
	}

	save(user:IUserEntity):Promise<number> {
		return this.userResource.find({
			where: {id: user.getId()},
			include: [{
				model: this.projectResource,
				as: 'stars',
			}],
		})
			.then((userResource:any) => userResource ? userResource.update(user.getData()) : this.userResource.create(user.getData()))
			.then((userResource:any) => user.getStars().length && userResource.setStars(user.getStars()))
			.then(() => user.getId());
	}
}
