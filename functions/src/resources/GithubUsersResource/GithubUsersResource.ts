import DatabaseConnection from './../DatabaseConnection';
import DatabaseAdapter from './../DatabaseAdapter';
import * as _ from 'lodash';

const GITHUB_USERS_TABLE = process.env.GITHUB_USERS_TABLE;
const GITHUB_USERS_INDEX = process.env.GITHUB_USERS_INDEX;

export default class GithubTeamsResource {
  private adapter: any;

  constructor(db: DatabaseConnection) {
    this.adapter = new DatabaseAdapter(db);
  }

  save(data: any): Promise<any> {
    const preparedData = data.map((item:any) => ({
      PutRequest: {Item: _.pickBy(item, (val:any) => val !== '')}
    }));

    return this.adapter.createCollection({[GITHUB_USERS_TABLE]: preparedData});
  }

  getById(id: string): Promise<any> {
    return this.adapter.getById(GITHUB_USERS_TABLE, {id});
  }

  getByIds(ids:any[]): Promise<any> {
    return this.adapter.getByIds(GITHUB_USERS_TABLE, ids.map((id:string) => ({'id': id})))
      .then((data:any) => data.Responses[GITHUB_USERS_TABLE])
  }
}
