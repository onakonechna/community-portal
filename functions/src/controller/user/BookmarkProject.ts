import {Request, Response} from '../../../config/Types';
import IController from '../IController';
import Bookmark from '../../../src/model/Bookmark';

export default class BookmarkProject implements IController {
	private bookmark;

	constructor() {
		this.bookmark = new Bookmark();
	}

	public execute(req: Request, res: Response) {
		this.bookmark.add(req.body.id, req.tokenContents.id)
			.then(() => res.status(200).json({id: req.body.id}))
			.catch((err: any) => console.log(err) || res.status(200).json({
				error: true,
				message: 'Cannot bookmark project'
			}));
	}
}