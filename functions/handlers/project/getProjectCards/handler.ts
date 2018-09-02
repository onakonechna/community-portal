import { Request, Response } from './../../../config/Types';
import Endpoint from './../../../src/EndpointWrapper';
import GithubService from "../../../src/services/GithubService";
import { ProjectResource } from './../../../config/Components';
import DatabaseConnection from "../../../src/resources/DatabaseConnection";
import Project from "../../../src/resources/ProjectResource/Project";

const dbConnection = new DatabaseConnection();
const projectResource = new ProjectResource(dbConnection);
const githubService = new GithubService();
const getProjectsEndpoint = new Endpoint('/projects/', 'get');

getProjectsEndpoint.configure((req: Request, res: Response) => {
  projectResource.getProjects()
    .then((result:any) => result.Items)
    .then((projectsData:any[]) => projectsData.map((projectData:any) => new Project(projectData)))
    .then((projects:any[]) => Promise.all(projects.map((project:any) =>
      projectResource.getGithubProjectUpvotes(project.getGithubOrganizationName(), project.getGithubRepositoryName())
    ))
      .then((projectsUpvote:any) => ({projects, projectsUpvote})))
    .then(({projects, projectsUpvote}) => {
      projectsUpvote.forEach((upvote:any, index:number) => {
        projects[index].set('upvotes', upvote.data);
      });

      return projects;
    })
    .then((projects:any) => Promise.all(projects.map((project:any) =>
      projectResource.updateUpvoteCount(project.get('project_id'), project.get('upvotes'))
    ))
      .then(() => projects))
    .then((projects:any) => res.status(200).json({
      data: projects.map((project:any) => project.getData())
    }))
    .catch((err:any) => console.log('err', err) || res.status(200).json({err: err, message: 'Cannot get projects'}))
});

export const handler = getProjectsEndpoint.execute();
