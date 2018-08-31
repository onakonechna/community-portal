import DatabaseConnection from './../DatabaseConnection';
import DatabaseAdapter from './../DatabaseAdapter';
import * as _ from 'lodash';

const TEAMS_TO_USERS_INDEX = process.env.TEAMS_TO_USERS_INDEX;

export default class TeamsToUsersResource {
  private adapter: any;

  constructor(db: DatabaseConnection) {
    this.adapter = new DatabaseAdapter(db);
  }

  setTeamToUsersIndex(data: any): Promise<any> {
    const preparedData = data.map((item:any) => ({
      PutRequest: {Item: _.pickBy(item, (val:any) => val !== '')}
    }));

    return this.adapter.createCollection({[TEAMS_TO_USERS_INDEX]: preparedData});
  }
}
