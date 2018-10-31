import databaseConnection, { databaseTypes } from "./DatabaseConnectionMariaDb";

import User from './user/resource/User';
import Project from './project/resource/Project';
import Scope from './scope/resource/Scope';

const connection = databaseConnection.connect();
const user = User(connection, databaseTypes);
const project = Project(connection, databaseTypes);
const scope = Scope(connection, databaseTypes);

user.associate(project);
user.associateScopes(scope);
project.associate(user);

connection.sync({force:true})
	.then(() => connection.close());
