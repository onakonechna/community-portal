import Endpoint from './../../../src/EndpointWrapper';
import { Request, Response } from "../../../config/Types";
import DatabaseConnection from "../../../src/resources/DatabaseConnection";
import ProjectResource from "../../../src/resources/ProjectResource/ProjectResource";
import UserResource from "../../../src/resources/UserResource/UserResource";
import User from "../../../src/resources/UserResource/User";

const dbConnection = new DatabaseConnection();
const projectResource = new ProjectResource(dbConnection);
const userResource = new UserResource(dbConnection);
const createProjectContributors = new Endpoint('/project/create-project-contributors', 'post');

createProjectContributors.configure((req: Request, res: Response) => {

  const projectId = req.body.project_id;
  const githubProjectId = req.body.github_project_id;
  const usersList = req.body.usersList.map((user:any) => new User(user));

  userResource.saveUsers(usersList.map((user:any) => user.getData()))
    .then(() => {
      let promises:any[] = [];
      usersList.forEach((user:any) => promises.push(projectResource.addContributor({
        project_id: projectId,
        user_id: user.get('user_id'),
        avatar_url: user.get('avatar_url')
      })));

      return Promise.all(promises);
    })
    .then(() => {
      let promises:any[] = [];

      usersList.forEach((user:any) => promises.push(userResource.addProject({
        project_id: githubProjectId,
        user_id: user.get('user_id')
      })));

      return Promise.all(promises);
    })
    .then(() => res.status(200).json({data: {github_project_id: req.body.project_id}}))
    .catch((err:any) => {
        let promises:any[] = [];
        usersList.forEach((user:any) => promises.push(projectResource.addContributor({
            project_id: projectId,
            user_id: user.get('user_id'),
            avatar_url: user.get('avatar_url')
        })));

        return Promise.all(promises)
            .then(() => {
                let promises:any[] = [];

                usersList.forEach((user:any) => promises.push(userResource.addProject({
                    project_id: githubProjectId,
                    user_id: user.get('user_id')
                })));

                return Promise.all(promises);
            })
            .then(() => res.status(200).json({qwerty: {github_project_id: req.body.project_id}}))
            .catch((err:any) => console.log(err) ||
                res.status(200).json({error:true, message: err}));
       });
});

export const handler = createProjectContributors.execute();
