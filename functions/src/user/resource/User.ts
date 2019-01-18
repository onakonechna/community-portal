export default (connection:any, databaseTypes:any) => {
	const User = connection.define('users', {
		id: {
			type: databaseTypes.INTEGER,
			primaryKey: true
		},
		avatar_url: databaseTypes.TEXT,
		company: databaseTypes.STRING,
		email: databaseTypes.STRING,
		location: databaseTypes.STRING,
		bio: databaseTypes.STRING,
		blog: databaseTypes.STRING,
		name: databaseTypes.STRING,
		two_factor_authentication: databaseTypes.BOOLEAN,
		access_token: databaseTypes.STRING,
		login: databaseTypes.STRING,
		url: databaseTypes.TEXT,
		createdAt: {
			type: databaseTypes.DATE,
			field: 'created_at',
		},
		updatedAt: {
			type: databaseTypes.DATE,
			field: 'updated_at'
		},
	});

	User.associateProject = (project) => {
		User.belongsToMany(project, {as: 'stars', through: 'project_stars', foreignKey: 'userId'});
		User.belongsToMany(project, {as: 'contributionProjects', through: 'project_contributors', foreignKey: 'userId'});
		User.belongsToMany(project, {as: 'bookmarkedProjects', through: 'project_bookmarked', foreignKey: 'userId'});
	};

	User.associateScopes = (scopes) => {
		User.belongsToMany(scopes, {as: 'scopes', through: 'user_scopes', foreignKey: 'userId', targetKey: 'scope', timestamps: false})
	};

	return User;
}