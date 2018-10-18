import IUserResource from '../api/User/IUserResource';
import UserResource from './UserResource';

class User {
	private resource;

	constructor(userResource:IUserResource) {
		this.resource = userResource;
	}

	save() {
		this.resource.save({
			github_id: 99,
			avatar_url: '33222',
		});
	}
	getByGithubId() {

	}
	getListByGithubIds() {

	}
	delete() {

	}
	deleteByGithubId() {

	};
}

new User(new UserResource()).save();