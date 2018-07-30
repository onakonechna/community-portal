import * as _ from 'lodash';
import DatabaseConnection from './../DatabaseConnection';
import DatabaseAdapter from './../DatabaseAdapter';

const SKILLS_TABLE = process.env.SKILLS_TABLE;

interface SkillResourceInterface {
  scan(data: any): Promise<any>;
}

export default class SkillResource implements SkillResourceInterface {
  private adapter: any;

  constructor(db: DatabaseConnection) {
    this.adapter = new DatabaseAdapter(db);
  }

  scan(data: any): Promise<any> {
    return this.adapter.scan(SKILLS_TABLE);
  }
}
