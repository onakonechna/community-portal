import * as _ from 'lodash';
import DatabaseConnection from './../DatabaseConnection';
import DatabaseAdapter from './../DatabaseAdapter';

const PROJECTS_TABLE = process.env.PROJECTS_TABLE;
const PROJECTS_INDEX = process.env.PROJECTS_INDEX;

interface ProjectResourceInterface {
  create(data: any): Promise<any>;
  getCards(data: any): Promise<any>;
  getById(data: any): Promise<any>;
  edit(data: any): Promise<any>;
  updateStatus(data: any): Promise<any>;
  upvote(data: any): Promise<any>;
  delete(data: any): Promise<any>;
}

export default class ProjectResource implements ProjectResourceInterface {
  private adapter: any;

  constructor(db: DatabaseConnection) {
    this.adapter = new DatabaseAdapter(db);
  }

  create(data: any): Promise<any> {
    // append additional data
    const unixTimestamp = new Date().getTime();
    data.status = 'open';
    data.upvotes = 0;
    data.created = unixTimestamp;
    data.updated = unixTimestamp;
    data.completed = 0;

    return this.adapter.create(PROJECTS_TABLE, data);
  }

  getCards(data: any): Promise<any> {
    return this.adapter.get(
      PROJECTS_TABLE,
      PROJECTS_INDEX,
      '#status = :status',
      { '#status': 'status' },
      { ':status': 'open' },
      false,
    );
  }

  getById(data: any): Promise<any> {
    return this.adapter.getById(PROJECTS_TABLE, data);
  }

  edit(data: any): Promise<any> {
    const { project_id } = data;
    delete data['project_id'];

    return this.adapter.update(PROJECTS_TABLE, { project_id }, data);
  }

  updateStatus(data: any): Promise<any> {
    const { project_id, status } = data;
    return this.adapter.update(PROJECTS_TABLE, { project_id }, { status });
  }

  upvote(data: any): Promise<any> {
    return this.adapter.add(PROJECTS_TABLE, data, 'upvotes', 1);
  }

  delete(data: any): Promise<any> {
    return this.adapter.delete(PROJECTS_TABLE, data);
  }
}
