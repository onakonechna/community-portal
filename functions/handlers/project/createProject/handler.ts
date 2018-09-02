import Endpoint from './../../../src/EndpointWrapper';
import { Request, Response } from "../../../config/Types";
import DatabaseConnection from "../../../src/resources/DatabaseConnection";
import ProjectResource from "../../../src/resources/ProjectResource/ProjectResource";
import Project from '../../../src/resources/ProjectResource/Project';
import User from "../../../src/resources/UserResource/User";

const dbConnection = new DatabaseConnection();
const projectResource = new ProjectResource(dbConnection);
const projectCreateEndpoint = new Endpoint('/project', 'post');

projectCreateEndpoint.configure((req: Request, res: Response) => {
  const user = new User(req.tokenContents);
  const project = new Project({...req.body, owner: user.get('user_id')});

  if (!user.isScopeValid(user.get('scopes'), 'write:project')) {
    return res.status(401).json({payload: {
      error: true,
        message: 'User does not have the required scope to create project'}
    });
  }

  projectResource.getGithubProjectUpvotes(project.getGithubOrganizationName(), project.getGithubRepositoryName())
    .then((result:any) => {
      project.set('upvotes', result.data);
      return project;
    })
    .then((project:any) => projectResource.getGithubProjectId(project.getGithubOrganizationName(), project.getGithubRepositoryName())
      .then((result:{data:string}) => {
        project.set('github_project_id', result.data);
        return project;
       })
    )
    .then((project:any) => new Promise((resolve:any) => Promise.all([
        projectResource.setProjectToIndexStars(
          project.getGithubRepositoryName(),
          project.get('github_project_id'),
          project.getGithubOrganizationName()
        ),
        projectResource.create(project.getData())
      ]).then((result:any) => resolve(project))
    ))
    .then(() => res.status(200).json({payload:{data: project.get('project_id')}}))
    .catch((err:any) => res.status(200).json({payload:{error:true, message: 'Team creating is failed'}}));
});

export const handler = projectCreateEndpoint.execute();
