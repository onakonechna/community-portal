import DatabaseConnection from "../../../src/resources/DatabaseConnection";
import UserResource from "../../../src/resources/UserResource/UserResource";
import ProjectResource from "../../../src/resources/ProjectResource/ProjectResource";

const dbConnection = new DatabaseConnection();
const userResource = new UserResource(dbConnection);
const projectResource = new ProjectResource(dbConnection);

export const handler = (event:any, context:any, callback:any) => {
  projectResource.getProjectToIndexStars()
    .then((result:any) => result.Items)
    .then((projects:any[]) => Promise.all(projects.map((project:any) =>
      projectResource.getGithubProjectUpvotes(project.project_organization, project.project_name)
    )).then((projectsUpvote:any) => ({projects, projectsUpvote})))
    .then(({projects, projectsUpvote}) => {
      projects.forEach((project:any, index:number) => project['starts'] = projectsUpvote[index].data);

      return projects;
    })
    .then((projects:any) => {
      const promises:any[] = [];

      projects.forEach((project:any) => {
        const requestsQuantity = Math.ceil(Number(project.starts) / 30);

        for (let i = 1; i <= requestsQuantity; ++i) {
          promises.push(projectResource.getStarredUsers(project.project_organization, project.project_name, i));
        }
      });

    })
    .catch((err:any) => console.log(err))
};
