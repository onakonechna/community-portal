/*
import User from './User';
import IUserResource from '../api/User/IUserResource';
import databaseConnection, { databaseTypes } from "../resources/DatabaseConnectionMariaDb";

class UserResource implements IUserResource{
	private connection;
	private userDTO;

	constructor() {
		this.connection = databaseConnection.connect();
		this.userDTO = User(this.connection, databaseTypes);
	}

	save(user:any) {
		return this.userDTO.upsert(user);
	}

	getByGithubId(id:Number) {

	}
	getListByGithubIds(ids:Number[]) {

	}
	delete(user:any) {

	}
	deleteByGithubId(id:Number) {

	};
}

export default UserResource;*/
