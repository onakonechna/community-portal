export default (connection:any, databaseTypes:any) => {
	const StatisticPullRequest = connection.define('statistic_contributor_prs', {
		row_id: {
			type: databaseTypes.INTEGER,
			primaryKey: true
		},
		closed_at: databaseTypes.DATE,
		created_at: databaseTypes.DATE,
		repository: databaseTypes.STRING,
		organization: databaseTypes.STRING,
		full: databaseTypes.STRING,
		user_login: databaseTypes.STRING,
		achievements: databaseTypes.STRING,
		user_id: databaseTypes.INTEGER,
		points: databaseTypes.INTEGER,
		pr_number: databaseTypes.INTEGER,
		state: databaseTypes.STRING,
		merged: databaseTypes.INTEGER,
	}, {
		timestamps: false
	});

	return StatisticPullRequest;
}