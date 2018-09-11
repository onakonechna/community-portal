import * as _ from 'lodash';

export default class Project {
  private owner:string;
  private upvotes:number;
  private slack_channel:string;
  private display:string;
  private completed_history:any;
  private estimated:number;
  private description:string;
  private completed:number;
  private technologies:any[];
  private github_address:string;
  private size:string;
  private due:number;
  private project_id:string;
  private name:string;
  private updated:number;
  private status:string;
  private created:number;
  private github_project_id:string;
  private contributors:any;
  private bookmarked:any;

  constructor(data:any) {
    this.owner = data.owner;
    this.upvotes = data.upvotes || 0;
    this.slack_channel = data.slack_channel;
    this.display = data.display || 'true';
    this.completed_history = data.completed_history || {};
    this.estimated = data.estimated;
    this.description = data.description || '';
    this.completed = data.completed || 0;
    this.technologies = data.technologies;
    this.github_address = data.github_address;
    this.size = data.size;
    this.due = data.due;
    this.bookmarked = data.bookmarked || {};
    this.project_id = data.project_id;
    this.name = data.name;
    this.github_project_id = data.github_project_id;
    this.updated =  data.updated || new Date().getTime();
    this.created =  data.created || new Date().getTime();
    this.status = data.status || 'open';
    this.contributors = data.contributors || {};
  }

  public getGithubRepositoryName() {
    const splitGithubAddress = this.github_address.split('/');

    return splitGithubAddress[splitGithubAddress.length - 1] ||
      splitGithubAddress[splitGithubAddress.length - 2];
  }

  public getGithubOrganizationName() {
    const splitGithubAddress = this.github_address.split('/');

    return splitGithubAddress[splitGithubAddress.length - 1] ?
      splitGithubAddress[splitGithubAddress.length - 2] :
      splitGithubAddress[splitGithubAddress.length - 3]
  }

  public get(property:string) {
    return this[property];
  }

  public set(property:string, value:any) {
    this[property] = value;
  }

  public getData() {
    return this.removeEmptyValues({
      owner: this.owner,
      upvotes: this.upvotes,
      display: this.display,
      slack_channel: this.slack_channel,
      completed_history: this.completed_history,
      estimated: this.estimated,
      status: this.status,
      description: this.description,
      completed: this.completed,
      technologies: this.technologies,
      github_address: this.github_address,
      size: this.size,
      due: this.due,
      project_id: this.project_id,
      name: this.name,
      updated: this.updated,
      created: this.created,
      github_project_id: this.github_project_id,
      contributors: this.contributors,
      bookmarked: this.bookmarked
    });
  }

  private removeEmptyValues(data:any) {
    return _.pickBy(data, (val:any) => val !== '');
  }
}