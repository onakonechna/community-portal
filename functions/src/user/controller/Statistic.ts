import {Request, Response} from '../../../config/Types';
import IController from '../../api/IController';
import UserStatistic from '../model/Statistic';

export default class Statistic implements IController {
	private statistic;

	constructor() {
		this.statistic = new UserStatistic();
	}

	public execute(req: Request, res: Response) {
		this.statistic.getByUserId(req.params.id)
			.then((data:any) => res.status(200).json({data: this.prepareData(data), real: data}))
			.catch((err: any) => {
				console.log(err);
				res.status(200).json({
					error: true,
					message: 'Cannot get user statistic'
				})
			});
	}

	private prepareData(data) {
		const repositories = this.getRepositories(data);
		const mergedPRsByRepository = this.getMergedByRepository(data, repositories);
		const closedPRsByRepository = this.getClosedRepository(data, repositories);
		const result:any[] = [];

		repositories.forEach((repository:string) => {
			let item:any = {};

			item.repository = repository;
			item.merged = mergedPRsByRepository[repository];
			item.closed = closedPRsByRepository[repository];
			item.mergedQuantity = item.merged.length;
			item.closedQuantity = item.closed.length;
			item.createdQuantity = item.closedQuantity + item.mergedQuantity;
			item.points = item.merged.reduce((accumulator, currentValue) => Number.isInteger(accumulator) ?
				accumulator + currentValue.points :
				accumulator.points + currentValue.points);
			item.achievements = this.getAchievements(item.merged);

			result.push(item);
		});

		return result.sort((first, second) => second.points - first.points);
	}

	private getAchievements(data:any[]) {
		const achievements = {};

		data.forEach(row => {
			if (!row.achievements) {
				return;
			}

			const prAchievments = row.achievements.split(',');

			prAchievments.forEach(achievement => {
				if (!achievements[achievement]) {
					achievements[achievement] = 1;
				} else {
					achievements[achievement] += 1;
				}
			});
		});

		return achievements;
	}

	private getRepositories(data:any[]):string[] {
		const repositories = {};

		data.forEach(row => {
			if (!repositories[row.full]) {
				repositories[row.full] = true;
			}
		});

		return Object.keys(repositories);
	}

	private getMergedByRepository(data:any[], repositories:string[]) {
		const result = {};

		repositories.forEach((repository:string) => {
			result[repository] = data.filter(row => row.full === repository && row.merged === 1);
		});

		return result;
	}

	private getClosedRepository(data:any[], repositories:string[]) {
		const result = {};

		repositories.forEach((repository:string) => {
			result[repository] = data.filter(row => row.full === repository && row.merged === 0);
		});

		return result;
	}
}