import databaseConnection, { databaseTypes } from "./resources/DatabaseConnectionMariaDb";

import User from './resource/User';
import Project from './resource/Project';

const connection = databaseConnection.connect();
const user = User(connection, databaseTypes);
const project = Project(connection, databaseTypes);

user.associate(project);
project.associate(user);

connection.sync({force:true});