import DatabaseConnection from './../DatabaseConnection';
import DatabaseAdapter from './../DatabaseAdapter';
import * as _ from 'lodash';
import { v4 as uuid } from 'uuid';

const PARTNER_TEAMS_TABLE = process.env.PARTNER_TEAMS_TABLE;
const PARTNER_TEAMS_INDEX = process.env.PARTNER_TEAMS_INDEX;
const PARTNER_TEAM_MEMBERS_TABLE = process.env.PARTNER_TEAM_MEMBERS_TABLE;
const PARTNER_TEAM_MEMBERS_INDEX = process.env.PARTNER_TEAM_MEMBERS_INDEX;
const PARTNER_TEAM_OWNERS_TABLE = process.env.PARTNER_TEAM_OWNERS_TABLE;
const PARTNER_TEAM_OWNERS_INDEX = process.env.PARTNER_TEAM_OWNERS_INDEX;

interface PartnersTeamResourceInterface {
  save(team: any, members:any[], owners:any[]): Promise<any>;
  getTeams(): Promise<any>;
}

export default class PartnersTeamResource implements PartnersTeamResourceInterface {
  private adapter: any;

  constructor(db: DatabaseConnection) {
    this.adapter = new DatabaseAdapter(db);
  }

  save(team: any, members:any, owners:any): Promise<any> {
    const mapCallback = (item:any) => ({PutRequest: {Item: {..._.pickBy(item, val => val !== ''), row_id: uuid()}}});
    let collections:any = {};

    let promises:any[] = [this.adapter.create(PARTNER_TEAMS_TABLE, team)];

    if (members && members.length) {
      collections[PARTNER_TEAM_MEMBERS_TABLE] = members.map(mapCallback);
    }

    if (owners && owners.length) {
      collections[PARTNER_TEAM_OWNERS_TABLE] = owners.map(mapCallback)
    }

    if (!_.isEmpty(collections)) {
      promises.push(this.adapter.addItems(collections))
    }

    return Promise.all(promises);
  }

  getTeam(id:string): Promise<any> {
    return this.adapter.getById(PARTNER_TEAMS_TABLE, { id });
  }

  getTeamsbyOwnerId(id:string): Promise<any> {
    return this.adapter.getCollection(PARTNER_TEAM_OWNERS_TABLE, 'user_id', id)
      .then((data:any) => data.Items);
  }

  getTeamsbyMemberId(id:string): Promise<any> {
    return this.adapter.getCollection(PARTNER_TEAM_MEMBERS_TABLE, 'user_id', id)
      .then((data:any) => data.Items);
  }

  getTeamOwners(id:string): Promise<any> {
    return this.adapter.getCollection(PARTNER_TEAM_OWNERS_TABLE, 'team_id', id)
      .then((data:any) => data.Items);
  }

  getTeamMembers(id:string): Promise<any> {
    return this.adapter.getCollection(PARTNER_TEAM_MEMBERS_TABLE, 'team_id', id)
      .then((data:any) => data.Items);
  }

  setPartnerTeamUserStatus(id:string, status: string, type:string): Promise<any> {
    const table = type === 'partner_team_owner' ?  PARTNER_TEAM_OWNERS_TABLE : PARTNER_TEAM_MEMBERS_TABLE;

    return this.adapter.addToMapColumn(
      table,
      { row_id: id },
      'status',
      status
    )
  }

  getTeams(): Promise<any> {
    return this.adapter.get(
      PARTNER_TEAMS_TABLE,
      'active',
      1,
      PARTNER_TEAMS_INDEX,
      false
    );
  }
}
