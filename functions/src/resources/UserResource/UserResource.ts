import DatabaseConnection from './../DatabaseConnection';
import DatabaseAdapter from './../DatabaseAdapter';
import GithubService from "../../services/GithubService";
import {
  PROJECTS_STARS_TABLE,
  PROJECTS_STARS_USER_ID_INDEX
} from '../ProjectResource/ProjectResource';

export const USERS_TABLE = process.env.USERS_TABLE;
export const USERS_INDEX = process.env.USERS_INDEX;
export const USERS_LOGIN_INDEX = process.env.USERS_LOGIN_INDEX;

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

  getUsersById(ids: string[], fields:string[] = undefined): Promise<any> {
    return this.adapter.getByIds(USERS_TABLE, ids.map((id:string) => ({'user_id': id})), fields)
      .then((data:any) => {
        let users = data.Responses ? data.Responses.users : [];

        users.forEach((item:any) => delete item['access_token']);
        return {
          data: users
        }
      });
  }

  getByLogin(login: string): Promise<any> {
    return this.adapter.get(USERS_TABLE, 'login', login, USERS_LOGIN_INDEX)
  }

  getUsersByLogin(usersLogin: any): Promise<any> {
    const promises = usersLogin.map((data:any) => this.getByLogin(data));
    const reflect = (p:any) => p.then(
      (data:any) => ({data, status: "success" }),
      (err:any) => ({err, status: "error" }));

    return new Promise((resolve:any, reject:any) => {
      Promise.all(promises.map(reflect)).then(function(result:any){
        let data:any[] = [];

        result.forEach((item:any) => {
          if (item.status === 'error') {
            reject(item.data)
          }
          data.push(item.data.Items[0])
        });

        resolve(data);
      })
    });
  }

  update(data: any): Promise<any> {
    const { user_id } = data;
    delete data['user_id'];

    return this.adapter.update(USERS_TABLE, { user_id }, data);
  }

  upvoteProject(organization:string, projectName:string, accessToken:string): Promise<any> {
    const promises:any[] = [
      this.api.upvoteRepository(organization, projectName, accessToken),
    ];

    return Promise.all(promises).then((result:any) => ({data: result[0]}));
  }

  downvoteProject(organization:string, projectName:string, accessToken:string): Promise<any> {
    const promises:any[] = [
      this.api.downvoteRepository(organization, projectName, accessToken),
    ];

    return Promise.all(promises).then((result:any) => ({data: result[0]}));
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

  addUserTwoFactorAuthentication(data:any): Promise<any> {
    return this.adapter.addToMapColumn(
      USERS_TABLE,
      { user_id: data.user_id },
      'two_factor_authentication',
      data.two_factor_authentication
    )
  }

  addUserEmailVerified(data:any): Promise<any> {
    return this.adapter.addToMapColumn(
      USERS_TABLE,
      { user_id: data.user_id },
      'emailVerified',
      data.emailVerified
    )
  }

  addUserAsPartnerTeamMember(data:any): Promise<any> {
    return this.adapter.addToMapColumn(
      USERS_TABLE,
      { user_id: data.user_id },
      'partner_team_member',
      {
        status: data.status,
        team_id: data.team_id
      }
    )
  }

  addUserAsPartnerTeamOwner(data:any): Promise<any> {
    return this.adapter.addToMapColumn(
      USERS_TABLE,
      { user_id: data.user_id },
      'partner_team_owner',
      {
        status: data.status,
        team_id: data.team_id
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
