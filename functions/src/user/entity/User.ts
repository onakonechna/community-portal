import * as _ from "lodash";
import IUserEntity from '../api/IUserEntity';

export default class User implements IUserEntity  {
	private data;

	constructor(data:any) {
		this.data = {
			id: data.id,
			avatar_url: data.avatar_url || '',
			company: data.company || '',
			email: data.email || '',
			location: data.location || '',
			name: data.name || '',
			two_factor_authentication: data.two_factor_authentication,
			access_token: data.access_token || '',
			login: data.login || '',
			url: data.url || '',
			scopes: data.scopes || '',
			stars: data.stars || [],
			createdAt: data.createdAt,
			updatedAt: data.updatedAt
		};
	}

	set(data:object) {
		this.data = { ...this.data, ...data };
	}

	getId() {
		return this.data.id;
	}

	getAvatarUrl() {
		return this.data.avatar_url;
	}

	getCompany() {
		return this.data.company;
	}

	getEmail() {
		return this.data.email;
	}

	getLocation() {
		return this.data.location;
	}

	getName() {
		return this.data.name;
	}

	getTwoFactorAuthentication() {
		return this.data.two_factor_authentication;
	}

	getAccessToken() {
		return this.data.access_token;
	}

	getLogin() {
		return this.data.login;
	}

	getUrl() {
		return this.data.url;
	}

	getScopes() {
		return this.data.scopes;
	}

	getStars() {
		return this.data.stars;
	}

	getExistingData() {
		return _.pickBy(this.getData(), (val:any) => val);
	}

	getSecureData() {
		return _.omit(this.getData(), 'access_token');
	}

	getData() {
		return this.data;
	}
}