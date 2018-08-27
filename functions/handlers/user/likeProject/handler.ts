import Endpoint from './../../../src/EndpointWrapper';
import { Request, Response } from "../../../config/Types";
import DatabaseConnection from "../../../src/resources/DatabaseConnection";
import ProjectResource from '../../../src/resources/ProjectResource/ProjectResource';
import Project from '../../../src/resources/ProjectResource/Project';
import UserResource from '../../../src/resources/UserResource/UserResource';
import User from '../../../src/resources/UserResource/User';

const dbConnection = new DatabaseConnection();
const userResource = new UserResource(dbConnection);
const projectResource = new ProjectResource(dbConnection);
const likeProjectEndpoint = new Endpoint('/user/likeProject', 'post');

likeProjectEndpoint.configure((req: Request, res: Response) => {
  Promise.all([
    userResource.getById({user_id: req.tokenContents['user_id']}),
    projectResource.getProjectByGithubId({github_project_id: req.body.github_project_id})
  ])
    .then((result:any) => ({
      user: new User(result[0].Item),
      project: new Project(result[1])
    }))
    .then(({user, project}) =>
      new Promise((resolve:any, reject:any) => resolve(user.isProjectUpvoted(project.get('github_project_id')) ?
        Promise.all([
          projectResource.updateUpvoteCount(project.get('project_id'), (project.get('upvotes') -1 )),
          projectResource.downvoteProject(project.get('github_project_id')),
          userResource.downvoteProject(
            project.get('github_project_id'),
            project.getGithubRepositoryName(),
            user.get('user_id'),
            user.get('access_token')
          )
        ]) :
        Promise.all([
          projectResource.updateUpvoteCount(project.get('project_id'), (project.get('upvotes') + 1)),
          projectResource.upvoteProject(
            project.get('github_project_id'),
            project.getGithubRepositoryName(),
            user.get('user_id'),
            user.get('name')
          ),
          userResource.upvoteProject(
            project.get('github_project_id'),
            project.getGithubRepositoryName(),
            user.get('user_id'),
            user.get('access_token')
          )
        ]))).then(() => ({user, project}))
    )
  .then(({user, project}) => res.status(200).json({payload:{
    github_project_id: project.get('github_project_id'),
    user_id: user.get('user_id')
  }}))
  .catch((error) => console.log('ERROR', error) || res.status(200).json({payload:{error: true}}))
});

export const handler = likeProjectEndpoint.execute();
