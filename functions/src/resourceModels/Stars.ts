/*
import User from './User';
import Projects from './Projects';
import databaseConnection, { databaseTypes } from "../resources/DatabaseConnectionMariaDb";

const connection = databaseConnection.connect();
const user = User(connection, databaseTypes);
const project = Projects(connection, databaseTypes);

export default (connection:any, databaseTypes:any) => {
	const Stars = connection.define('stars');

	Stars.belongsTo(Projects(connection, databaseTypes), {foreignKey: 'project_id'});
	Stars.belongsTo(User(connection, databaseTypes), {foreignKey: 'user_id'});

	return Stars;
	/!*Stars.associate = (models) => {
		Stars.hasMany(user, {
			foreignKey: {
				name: 'github_id',
				allowNull: false
			}
		});
		Stars.hasMany(project, {
			foreignKey: {
				name: 'github_id',
				allowNull: false
			}
		})
	};*!/
}*/
