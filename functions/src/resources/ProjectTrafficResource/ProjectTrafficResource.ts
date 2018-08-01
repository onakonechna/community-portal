import * as _ from 'lodash';
import DatabaseConnection from './../DatabaseConnection';
import DatabaseAdapter from './../DatabaseAdapter';

const PROJECT_TRAFFIC_TABLE = process.env.PROJECT_TRAFFIC_TABLE;

interface ProjectTrafficResourceInterface {
  getLastVisited(data: any): Promise<any>;
  recordProjectView(data: any): Promise<any>;
}

export default class ProjectTrafficResource implements ProjectTrafficResourceInterface {
  private adapter: any;

  constructor(db: DatabaseConnection) {
    this.adapter = new DatabaseAdapter(db);
  }

}
