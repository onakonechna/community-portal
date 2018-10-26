import databaseConnection, { databaseTypes } from "./resources/DatabaseConnectionMariaDb";

import User from './resource/User';
import Project from './resource/Project';
import Scope from './resource/Scope';

const connection = databaseConnection.connect();
const user = User(connection, databaseTypes);
const project = Project(connection, databaseTypes);
const scope = Scope(connection, databaseTypes);

scope.associate(user);
user.associate(project);
user.associateScopes(scope);
project.associate(user);

connection.sync({force:true})
	.then(() => connection.close());
