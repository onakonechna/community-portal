import axios, { AxiosResponse } from "axios";
import * as querystring from "querystring";

export default class Github {
	private token;

	constructor() {
		this.token = process.env.GITHUB_USER_TOKEN;
	}

	public getToken (code:string):Promise<any> {
		const options = {
			method: 'POST',
			url: 'https://github.com/login/oauth/access_token',
			headers: { 'content-length': 256 },
			data: {
				code,
				client_id: process.env.GITHUB_CLIENT_ID,
				client_secret: process.env.GITHUB_CLIENT_SECRET,
			},
		};

		return axios(options).then((res:AxiosResponse) => querystring.parse(res.data).access_token);
	}

	public getUserEmails (token:string) {
		const options = {
			method: 'GET',
			url: 'https://api.github.com/user/emails',
			headers: {
				'User-Agent': 'community-portal-app',
				'Authorization': `token ${token}`
			},
		};

		return axios(options).then((res:AxiosResponse) => res.data);
	}

	public getUserData (token:string) {
		const options = {
			method: 'GET',
			url: 'https://api.github.com/user',
			headers: {
				'User-Agent': 'community-portal-app',
				'Authorization': `token ${token}`
			},
		};

		return axios(options).then((res:AxiosResponse) => res.data);
	}

	public getStarredProjects (token:string) {
		const options = {
			method: 'GET',
			url: `https://api.github.com/user/starred`,
			headers: {
				'User-Agent': 'community-portal-app',
				'Authorization': `token ${token}`
			}
		};

		return axios(options).then((res:AxiosResponse) => res.data);
	}

	public getRepository(org:string, repos: string) {
		const options = {
			method: 'GET',
			url: `https://api.github.com/repos/${org}/${repos}`,
			headers: {
				'User-Agent': 'community-portal-app',
				'Authorization': `token ${this.token}`
			}
		};

		return axios(options).then((res:AxiosResponse) => res.data);
	}

	public getStarred(token:string) {
		const options = {
			method: 'GET',
			url: `https://api.github.com/user/starred`,
			headers: {
				'User-Agent': 'community-portal-app',
				'Authorization': `token ${token}`
			}
		};

		return axios(options).then((res:AxiosResponse) => res.data);
	}

	public addStar(org:string, repos:string, token:string) {
		const options = {
			method: 'PUT',
			url: `https://api.github.com/user/starred/${org}/${repos}`,
			headers: {
				'User-Agent': 'community-portal-app',
				'Authorization': `token ${token}`
			}
		};

		return axios(options).then((res:AxiosResponse) => res.data);
	}

	public removeStar(org:string, repos:string, token:string) {
		const options = {
			method: 'DELETE',
			url: `https://api.github.com/user/starred/${org}/${repos}`,
			headers: {
				'User-Agent': 'community-portal-app',
				'Authorization': `token ${token}`
			}
		};

		return axios(options).then((res:AxiosResponse) => res.data);
	}


	public getRepositoryStarsQuantity(org:string, repos: string) {
		return this.getRepository(org, repos).then((res:AxiosResponse) => res['stargazers_count'])
	}
}