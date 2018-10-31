export default (connection:any, databaseTypes:any) => {
	const Projects = connection.define('projects', {
		id: {
			type: databaseTypes.INTEGER,
			primaryKey: true
		},
		github_address: databaseTypes.STRING,
		short_description: databaseTypes.TEXT,
		description: databaseTypes.TEXT,
		technologies: {
			type:databaseTypes.TEXT,
			set: function(val:string[]) {
				return this.setDataValue('technologies', JSON.stringify(val));
			},
			get: function() {
				if (this.getDataValue('technologies')) {
					return JSON.parse(this.getDataValue('technologies'));
				}

				return [];
			}
		},
		name: databaseTypes.STRING,
		size: databaseTypes.STRING,
		status: databaseTypes.STRING,
		display: {
			type: databaseTypes.BOOLEAN,
			defaultValue: true
		},
		slack_channel: databaseTypes.STRING,
		estimated: databaseTypes.INTEGER,
		stargazers_count: databaseTypes.INTEGER,
		createdAt: {
			type: databaseTypes.DATE,
			field: 'created_at',
		},
		updatedAt: {
			type: databaseTypes.DATE,
			field: 'updated_at',
		},
	});


	Projects.associateUser = (user:any) => {
		Projects.belongsTo(user, {as:'owner'});
		Projects.belongsToMany(user, {as:'stars', through: 'project_stars', foreignKey: 'projectId'});
		Projects.belongsToMany(user, {as: 'contributors', through: 'project_contributors', foreignKey: 'projectId'});
		Projects.belongsToMany(user, {as: 'bookmarked', through: 'project_bookmarked', foreignKey: 'projectId'})
	};

	return Projects;
};