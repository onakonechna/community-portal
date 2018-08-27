import * as _ from 'lodash';
import DatabaseConnection from './../DatabaseConnection';
import DatabaseAdapter from './../DatabaseAdapter';
import GithubService from "../../services/GithubService";
import {
  PROJECTS_ORGANIZATION,
  PROJECTS_STARS_TABLE,
  PROJECTS_STARS_USER_ID_INDEX
} from '../ProjectResource/ProjectResource';

export const USERS_TABLE = process.env.USERS_TABLE;
export const USERS_INDEX = process.env.USERS_INDEX;

interface UserResourceInterface {
  create(data: any): Promise<any>;
  getById(data: any): Promise<any>;
  update(data: any): Promise<any>;
  addUpvotedProject(github_project_id:string, projectName:string, user_id:string): Promise<any>;
  removeUpvotedProject(github_project_id:string, projectName:string, user_id:string): Promise<any>;
  addBookmarkedProject(data: any): Promise<any>;
  getUpvotedProjects(data: any): Promise<any>;
  getBookmarkedProjects(data: any): Promise<any>;
  pledge(data: any): Promise<any>;
  subscribe(data: any): Promise<any>;
  delete(data: any): Promise<any>;
}

export default class UserResource implements UserResourceInterface {
  private adapter: any;
  private api: any;

  constructor(db: DatabaseConnection, Api?: any) {
    this.adapter = new DatabaseAdapter(db);
    this.api = Api ? new Api() : new GithubService();
  }

  create(data: any): Promise<any> {
    const { user_exists, user_id, access_token } = data;

    if (user_exists) {
      return this.adapter.update(USERS_TABLE, { user_id }, { access_token });
    }

    delete data['user_exists'];

    return this.adapter.create(USERS_TABLE, data);
  }

  getById(data: any): Promise<any> {
    const { user_id } = data;

    return this.adapter.getById(
      USERS_TABLE,
      { user_id }
    );
  }

  update(data: any): Promise<any> {
    const { user_id } = data;
    delete data['user_id'];

    return this.adapter.update(USERS_TABLE, { user_id }, data);
  }

  upvoteProject(githubProjectId:string, projectName:string, userId:string, accessToken:string): Promise<any> {
    const promises:any[] = [
      this.api.upvoteRepository(PROJECTS_ORGANIZATION, projectName, accessToken),
      this.addUpvotedProject(githubProjectId, projectName, userId)
    ];

    return Promise.all(promises).then((result:any) => ({data: result[1]['user_id']}));
  }

  downvoteProject(githubProjectId:string, projectName:string, userId:string, accessToken:string): Promise<any> {
    const promises:any[] = [
      this.api.downvoteRepository(PROJECTS_ORGANIZATION, projectName, accessToken),
      this.removeUpvotedProject(githubProjectId, projectName, userId)
    ];

    return Promise.all(promises).then((result:any) => ({data: result[1]['user_id']}));
  }

  addUpvotedProject(github_project_id:string, projectName:string, user_id:string): Promise<any> {
    return this.adapter.addToMap(
      USERS_TABLE,
      {user_id},
      'upvoted_projects',
      github_project_id,
      {
        name: projectName,
        github_project_id
      }
    )
  }

  addBookmarkedProject(data: any): Promise<any> {
    const { user_id, project_id } = data;
    return this.adapter.addToSetIfNotExists(
      USERS_TABLE,
      { user_id },
      'bookmarked_projects',
      project_id,
    );
  }

  removeUpvotedProject(github_project_id:string, projectName:string, user_id:string): Promise<any> {
    return this.adapter.removeFromMap(
      USERS_TABLE,
      {user_id},
      'upvoted_projects',
      github_project_id
    )
  }

  getGithubUpvotedProjects(access_token:string): Promise<any> {
    return this.api.getUserStarred(access_token);
  }

  getUpvotedProjects(user_id: string): Promise<any> {
    return this.adapter.get(
      PROJECTS_STARS_TABLE,
      'user_id',
      user_id,
      PROJECTS_STARS_USER_ID_INDEX,
      false
    );
  }

  getBookmarkedProjects(data: any): Promise<any> {
    const { user_id } = data;
    return this.adapter.getById(USERS_TABLE, { user_id });
  }

  pledge(data: any): Promise<any> {
    const { project_id, user_id } = data;
    return this.adapter.addToSetIfNotExists(
      USERS_TABLE,
      { user_id },
      'pledged_projects',
      project_id,
    );
  }

  subscribe(data: any): Promise<any> {
    const { user_id, project_id } = data;
    return this.adapter.addToSet(USERS_TABLE, { user_id }, 'subscribed_projects', project_id);
  }

  delete(data: any): Promise<any> {
    return this.adapter.delete(USERS_TABLE, data);
  }
}
