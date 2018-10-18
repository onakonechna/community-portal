export default (connection:any, databaseTypes:any) => {
	const Projects = connection.define('projects', {
		github_id: {
			type: databaseTypes.INTEGER,
			primaryKey: true
		},
		name: databaseTypes.STRING
	});

	Projects.associate = (User:any) => {
		Projects.belongsToMany(User, {as:'stars', through: 'project_stars', foreignKey: 'project_id'});
	};

	return Projects;
};