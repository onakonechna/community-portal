import { Request, Response } from '../../../config/Types';
import * as _ from 'lodash';
import IController from '../../api/IController';
import Github from '../../services/Github';
import User from '../model/User';
import UserFactory from '../entity/UserFactory';
import IUserEntity from '../api/IUserEntity';
import Project from '../../project/model/Project';
import AuthorizationService from "../../services/AuthorizationService";

export default class Authorization implements IController {
	private userFactory;
	private githubResource;
	private authorizationService;
	private project;
	private user;
	private userEntity;

	constructor() {
		this.userFactory = new UserFactory();
		this.githubResource = new Github();
		this.authorizationService = new AuthorizationService();
		this.project = new Project();
		this.user = new User();
	}

	public execute(req:Request, res:Response) {
		this.githubResource.getToken(req.body.code)
			.then((token:string) => this.collectData(token))
			.then(([userData, ...props]) => this.user.getById(userData.id)
				.then((entity:IUserEntity) => [userData, ...props, entity]))
			.then(([userData, emails, starredProjects, existingProjects, token, entity]) => {
				this.userEntity = entity || this.userFactory.create();

				this.userEntity.set({
					...userData, stars: this.getStarredProjects(existingProjects, starredProjects), emails, access_token: token
				});

				this.user.save(this.userEntity);
			})
			.then(() => res.status(200).json(this.getResponseObject(this.userEntity, this.authorizationService)))
			.catch((err:any) => {
				console.log(err);
				res.json({err: true, message: 'Authorization failed'})
			});
	}

	private getResponseObject(user:IUserEntity, authorizationService:any) {
		return {
			user_id: user.getId(),
			token: authorizationService.create(user.getSecureData())
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