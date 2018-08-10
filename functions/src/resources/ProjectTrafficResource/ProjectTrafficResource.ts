import * as _ from 'lodash';
import DatabaseConnection from './../DatabaseConnection';
import DatabaseAdapter from './../DatabaseAdapter';

const PROJECT_TRAFFIC_TABLE = process.env.PROJECT_TRAFFIC_TABLE;
const PROJECT_TRAFFIC_INDEX = process.env.PROJECT_TRAFFIC_INDEX;

interface ProjectTrafficResourceInterface {
  getLastVisited(data: any): Promise<any>;
  recordProjectView(data: any): Promise<any>;
}

export default class ProjectTrafficResource implements ProjectTrafficResourceInterface {
  private adapter: any;

  constructor(db: DatabaseConnection) {
    this.adapter = new DatabaseAdapter(db);
  }

  scan(data: any): Promise<any> {
    return this.adapter.scan(PROJECT_TRAFFIC_TABLE);
  }

  getLastVisited(data: any): Promise<any> {
    const { user_id } = data;
    return this.adapter.get(
      PROJECT_TRAFFIC_TABLE,
      'user_id',
      user_id,
      undefined,
      false,
      2,
    );
  }

  recordProjectView(data: any): Promise<any> {
    const { user_id, project_id, recommended } = data;
    const timestamp = new Date().getTime();

    return this.adapter.create(
      PROJECT_TRAFFIC_TABLE,
      { user_id, timestamp, project_id, recommended },
    );
  }

}