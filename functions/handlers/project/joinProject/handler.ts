import Endpoint from './../../../src/EndpointWrapper';
import { Request, Response } from "../../../config/Types";
import DatabaseConnection from "../../../src/resources/DatabaseConnection";
import ProjectResource from "../../../src/resources/ProjectResource/ProjectResource";
import UserResource from "../../../src/resources/UserResource/UserResource";
import User from "../../../src/resources/UserResource/User";
import Project from "../../../src/resources/ProjectResource/Project";

const dbConnection = new DatabaseConnection();
const projectResource = new ProjectResource(dbConnection);
const userResource = new UserResource(dbConnection);
const joinProjectEndpoint = new Endpoint('/project/join', 'post');

joinProjectEndpoint.configure((req: Request, res: Response) => {
  const user = new User(req.tokenContents);

  projectResource.getProjectByGithubId({github_project_id: req.body.project_id})
    .then((projectData:any) => new Project(projectData))
    .then((project:any) =>
      projectResource.addContributor({
        project_id: project.get('project_id'),
        user_id: user.get('user_id'),
        avatar_url: user.get('avatar_url'),
        html_url: user.get('html_url')
      }).then(() => project))
    .then((project:any) =>
      userResource.addProject({
        project_id: project.get('github_project_id'),
        user_id:user.get('user_id')
      })
    )
    .then((result:any) => res.status(200).json({data: {github_project_id: req.body.project_id}}))
    .catch((err:any) =>
      console.log(err) ||
      res.status(200).json({error:true, message: 'Cannot join project'}));
});

export const handler = joinProjectEndpoint.execute();
