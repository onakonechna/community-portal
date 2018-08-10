import { numProjectsToRecommend } from './../../../config/Config';

interface ProjectRecommendationControllerInterface {
  getRecommendations(data: any): (result: any) => any;
  getDefaultRecommendations(data: any): (result: any) => any;
  null(data: any): (result: any) => any;
}

function getRandomElements(array: any[], n: number) {
  const shuffled = array.sort(() => .5 - Math.random());
  return shuffled.slice(0, n);
}

/** get random projects
 * with a small probability, we randomly recommend projects to the user
 * this is to encourage exporation in the reinforcement learning process
 * which helps the model to better adapt to unknown states
 * k represents the maximum number of projects to *recommend*
 */
function getRandomProjects(project_id: string, projects: string[], k: number) {
  const projectPool: any = [];
  for (const project of projects) {
    if (project !== project_id) projectPool.push(project);
  }
  return getRandomElements(projectPool, k);
}

/**
 * get the projects with highest rewards (least proportion of pledgers)
 * we fall back to this approach when we have not recorded any observations
 * for the current sequence of projects viewed by the user
 * k represents the maximum number of projects to *recommend*
 */
function getTopProjects(project_id: string, projects: string[], k: number) {
  return projects
    .slice(0, k + 1)
    .filter((project: string) => project !== project_id)
    .slice(0, k);
}

function buildSecondLevelMap(nestedList: any) {
  const result = new Map(nestedList);
  result.forEach((list: any, key: any, map: Map<any, any>) => {
    map.set(key, new Map(list));
  });
  return result;
}

export default class ProjectRecommendationController
  implements ProjectRecommendationControllerInterface {

  // intermediary controllers
  getRecommendations(data: any) {
    return (result: any) => {
      try {
        /**
         * with 5% probability, we allow the recommender to randomly recommend projects
         * to the user to encourage exploration to enhance the reinforcement learning
         * process as it will be able to record transitions to currently unknown states
         */
        if (Math.random() < .05) return { should_explore: true };
        const recommended = result ? JSON.parse(result.Body.toString()) : undefined;
        return { recommended };
      } catch (e) {
        console.log(e);
      }
    };
  }

  getDefaultRecommendations(data: any) {
    const { project_id, should_explore } = data;
    return (result: any) => {
      try {
        /**
         * if defaultRecommendations does not exist on S3
         * it means we have not trained the model yet
         * we do not store anything so that the handler
         * will initiate the model training process
         * this solves the chicken and egg problem
         */
        if (!result) return {};

        const projects = JSON.parse(result.Body.toString());
        if (should_explore) {
          return { recommended : getRandomProjects(project_id, projects, numProjectsToRecommend) };
        }
        return { recommended: getTopProjects(project_id, projects, numProjectsToRecommend) };
      } catch (e) {
        console.log(e);
      }
    };
  }

  // special controllers
  null(data: any) {
    return (result: any) => {};
  }

}
