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
  addUpvoter(data: any): Promise<any>;
  removeUpvoter(data: any): Promise<any>;
  upvote(data: any): Promise<any>;
  downvote(data: any): Promise<any>;
  addPledgedHours(data: any): Promise<any>;
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
    data.display = 'true';
    data.upvotes = 0;
    data.created = unixTimestamp;
    data.updated = unixTimestamp;
    data.pledged = 0;
    data.completed = 0;
    data.pledged_history = {};
    data.completed_history = {};

    return this.adapter.create(PROJECTS_TABLE, data);
  }

  getCards(data: any): Promise<any> {
    return this.adapter.get(
      PROJECTS_TABLE,
      'display',
      'true',
      PROJECTS_INDEX,
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

  updateDisplay(data: any): Promise<any> {
    const { project_id, display } = data;
    return this.adapter.update(PROJECTS_TABLE, { project_id }, { display });
  }

  addUpvoter(data: any): Promise<any> {
    const { project_id, user_id } = data;
    return this.adapter.addToSetIfNotExists(PROJECTS_TABLE, { project_id }, 'upvoters', user_id);
  }

  addPledger(data: any): Promise<any> {
    const { project_id, user_id } = data;
    return this.adapter.addToSet(PROJECTS_TABLE, { project_id }, 'pledgers', user_id);
  }

  addSubscriber(data: any): Promise<any> {
    const { project_id, user_id } = data;
    return this.adapter.addToSet(PROJECTS_TABLE, { project_id }, 'subscribers', user_id);
  }

  removeUpvoter(data: any): Promise<any> {
    const { project_id, user_id } = data;
    return this.adapter.removeFromSetIfExists(PROJECTS_TABLE, { project_id }, 'upvoters', user_id);
  }

  upvote(data: any): Promise<any> {
    return this.adapter.add(PROJECTS_TABLE, data, 'upvotes', 1);
  }

  downvote(data: any): Promise<any> {
    return this.adapter.add(PROJECTS_TABLE, data, 'upvotes', -1);
  }

  addPledgedHours(data: any): Promise<any> {
    const { project_id, hours } = data;
    return this.adapter.add(PROJECTS_TABLE, { project_id }, 'pledged', hours);
  }

  addPledgedHistory(data: any): Promise<any> {
    const { project_id, hours } = data;
    const unixTimestamp = new Date().getTime();

    return this.adapter.addToMap(PROJECTS_TABLE, { project_id }, 'pledged_history', unixTimestamp, hours);
  }

  delete(data: any): Promise<any> {
    return this.adapter.delete(PROJECTS_TABLE, data);
  }
}
