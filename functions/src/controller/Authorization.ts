import { Request, Response } from '../../config/Types';
import IController from './IController';
import Github from '../../src/resource/Github';
import User from '../../src/model/User';
import Project from '../../src/model/Project';
import AuthorizationService from "../services/AuthorizationService";

export default class Authorization implements IController{
	private authorizationService;
	private githubResource;
	private project;
	private user;

	constructor() {
		this.githubResource = new Github();
		this.project = new Project();
		this.user = new User();
		this.authorizationService = new AuthorizationService();

	}

	public execute(req:Request, res:Response) {
		this.githubResource.getToken(req.body.code)
			.then((token:string) => this.collectData(token))
			.then(([userData, emails, starredProjects, existingProjects, token]) => {
				this.user.setStarredProjects(this.getStarredProjects(existingProjects, starredProjects));
				this.user.setData({
					id: userData.id,
					login: userData.login,
					avatar_url: userData.avatar_url,
					name: userData.name,
					company: userData.company,
					location: userData.location,
					email: userData.email,
					two_factor_authentication: userData.two_factor_authentication,
					url: userData.url,
					access_token: token
				});

				return this.user.save();
			})
			.then((userId: any) => res.status(200).json(this.getResponseObject(this.user, this.authorizationService)))
			.catch((err:any) => console.log(err) || res.json({err: true, message: 'Authorization failed'}))
	}

	private getResponseObject(user:any, authorizationService:any) {
		const data = user.getData();

		return {
			user_id: data.id,
			token: authorizationService.create(_.omit(data, 'access_token'))
		}
	}

	private getStarredProjects(existingProjects:any[], starredProjects:any[]) {
		return _.intersection(
			existingProjects.map((project:any) => project.get().id),
			starredProjects.map((item:any) => item.id)
		);
	}

	private collectData(token:string) {
		return Promise.all([
			this.githubResource.getUserData(token),
			this.githubResource.getUserEmails(token),
			this.githubResource.getStarredProjects(token),
			this.project.getListIds()
		]).then((data:any) => [...data, token])
	}
}