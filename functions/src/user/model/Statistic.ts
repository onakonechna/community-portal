import StatisticResource from '../resource/StatisticPullRequest';
import databaseConnection, { databaseTypes } from "../../DatabaseConnectionMariaDb";

export default class User {
	private connection;
	private statisticResource;
	private cache;

	constructor() {
		this.connection = databaseConnection.connect();
		this.statisticResource = StatisticResource(this.connection, databaseTypes);
		this.cache = {};
	}

	getByUserId(id:number) {
		if (this.cache[id]) {
			return new Promise((resolve, reject) => {
				resolve(this.cache[id]);
			})
		}

		return this.statisticResource.findAll({
			where: {
				user_id: id
			}
		}).then((data:any) => {
			this.cache[id] = data;

			return this.cache[id];
		})
	}
}
