import DatabaseConnection from './../DatabaseConnection';
import DatabaseAdapter from './../DatabaseAdapter';
import * as _ from 'lodash';

const GITHUB_PARTNER_TEAMS_TABLE = process.env.GITHUB_PARTNER_TEAMS_TABLE;
const GITHUB_PARTNER_TEAMS_INDEX = process.env.GITHUB_PARTNER_TEAMS_INDEX;

const createChunks = (data:any[], chunkSize:number, collection:any[] = []) => {
  collection.push(data.splice(0, chunkSize));

  if (data.length > chunkSize || data.length !== 0) {
    createChunks(data, chunkSize, collection);
  }

  return collection;
};

export default class GithubPartnerTeamsResource {
  private adapter: any;

  constructor(db: DatabaseConnection) {
    this.adapter = new DatabaseAdapter(db);
  }

  save(data: any): Promise<any> {
    let promises:any[] = [];
    let preparedData = data.map((item:any) => ({
      PutRequest: {Item: {..._.pickBy(item, (val:any) => val !== ''), id: item.id.toString()}}
    }));

    preparedData = createChunks(preparedData, 25);
    console.log(preparedData);
    preparedData.forEach((item:any) =>
      promises.push(this.adapter.createCollection({[GITHUB_PARTNER_TEAMS_TABLE]: item})));

    return Promise.all(promises).then((result:any[]) => {
      let err,
          unprocessedItems:any[] = [];

      result.forEach((item:any) => {
        if (!_.isEmpty(item.UnprocessedItems)) {
          err = 'Some items are Unprocessed';
          unprocessedItems.push(item.UnprocessedItems);
        }
      });

      return err ? {error: {message: err, unprocessedItems}, status: 500} : {status: 200}
    });
  }

  getByName(name: string): Promise<any> {
    return this.adapter.get(GITHUB_PARTNER_TEAMS_TABLE, 'name', name, GITHUB_PARTNER_TEAMS_INDEX)
  }
}
