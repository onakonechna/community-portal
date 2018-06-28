import * as _ from 'lodash';
import DatabaseConnection from './../DatabaseConnection';
import DatabaseAdapter from './../DatabaseAdapter';

const USERS_TABLE = process.env.USERS_TABLE;
const USERS_INDEX = process.env.USERS_INDEX;

interface UserResourceInterface {
  create(data: any): Promise<any>;
  getById(data: any): Promise<any>;
  update(data: any): Promise<any>;
  addUpvotedProject(data: any): Promise<any>;
  removeUpvotedProject(data: any): Promise<any>;
  getUpvotedProjects(data: any): Promise<any>;
  delete(data: any): Promise<any>;
}

export default class UserResource implements UserResourceInterface {
  private adapter: any;

  constructor(db: DatabaseConnection) {
    this.adapter = new DatabaseAdapter(db);
  }

  create(data: any): Promise<any> {
    return this.adapter.create(USERS_TABLE, data);
  }

  getById(data: any): Promise<any> {
    return this.adapter.getById(USERS_TABLE, data);
  }

  update(data: any): Promise<any> {
    const { user_id } = data;
    delete data['user_id'];

    return this.adapter.update(USERS_TABLE, { user_id }, data);
  }

  addUpvotedProject(data: any): Promise<any> {
    const { user_id, project_id } = data;
    return this.adapter.addToSet(USERS_TABLE, { user_id }, 'upvoted_projects', project_id);
  }

  removeUpvotedProject(data: any): Promise<any> {
    const { user_id, project_id } = data;
    return this.adapter.removeFromSet(USERS_TABLE, { user_id }, 'upvoted_projects', project_id);
  }

  getUpvotedProjects(data: any): Promise<any> {
    const { user_id } = data;
    return this.adapter.getById(USERS_TABLE, { user_id }, 'user_id, upvoted_projects');
  }

  delete(data: any): Promise<any> {
    return this.adapter.delete(USERS_TABLE, data);
  }
}
