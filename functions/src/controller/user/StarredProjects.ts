import {Request, Response} from '../../../config/Types';
import IController from '../IController';
import Github from '../../../src/resource/Github';
import User from '../../../src/model/User';

export default class StarredProjects implements IController {
	private githubResource;
	private user;

	constructor() {
		this.githubResource = new Github();
		this.user = new User();
	}

	public execute(req: Request, res: Response) {
		this.user.getTokenById(req.tokenContents.id)
			.then((token:string) => this.githubResource.getStarred(token))
			.then((projects:any) => res.status(200)
				.json({data: projects.map((project:any) => ({id: project.id}))}))
			.catch((err: any) => console.log(err) || res.status(200).json({
				error: true,
				message: 'Fetch starred projects is failed'
			}));
	}
}