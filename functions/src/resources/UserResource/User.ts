import * as _ from 'lodash';

export default class User {
  private user_id:string;
  private access_token:string;
  private avatar_url:string;
  private html_url:string;
  private name:string;
  private company:string;
  private location:string;
  private scopes:any;
  private email:string;
  private url:string;
  private login:string;
  private upvoted_projects:any;

  constructor(data:any) {
    this.user_id = data.user_id;
    this.access_token = data.access_token;
    this.avatar_url = data.avatar_url;
    this.html_url = data.html_url;
    this.name = data.name;
    this.company = data.company;
    this.location = data.location;
    this.scopes = data.scopes || {};
    this.email = data.email;
    this.url = data.url;
    this.login = data.login;
    this.upvoted_projects = data.upvoted_projects || [];
  }

  public get(property:string) {
    return this[property];
  }

  public set(property:string, value:any) {
    this[property] = value;
  }

  public updateData(data:any) {
    this.user_id = data.user_id || this.user_id;
    this.access_token = data.access_token || this.access_token;
    this.avatar_url = data.avatar_url || this.avatar_url;
    this.html_url = data.html_url || this.html_url;
    this.name = data.name || this.name;
    this.company = data.company || this.company;
    this.location = data.location || this.location;
    this.scopes = data.scopes || this.scopes;
    this.email = data.email || this.email;
    this.url = data.url || this.url;
    this.upvoted_projects = data.upvoted_projects || this.upvoted_projects;
  }

  public isProjectUpvoted(id:string) {
    return !!this.upvoted_projects[id];
  }

  public isScopeValid = (scopes:any[], scope:string) => scopes && _.includes(scopes, scope);

  public getData() {
    return this.removeEmptyValues({
      user_id: this.user_id,
      access_token: this.access_token,
      avatar_url: this.avatar_url,
      html_url: this.html_url,
      name: this.name,
      company: this.company,
      location: this.location,
      scopes: this.scopes,
      email: this.email,
      url: this.url,
      login: this.login,
      upvoted_projects: this.upvoted_projects
    });
  }

  public getPublicData() {
    return this.removeEmptyValues({
      user_id: this.user_id,
      avatar_url: this.avatar_url,
      html_url: this.html_url,
      name: this.name,
      company: this.company,
      location: this.location,
      scopes: this.scopes,
      email: this.email,
      url: this.url,
      login: this.login,
      upvoted_projects: this.upvoted_projects
    })
  }

  private removeEmptyValues(data:any) {
    return _.pickBy(data, (val:any) => val !== '');
  }
}