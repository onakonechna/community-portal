interface ProjectRecommendationEngineInterface {
  getRecommendations(data: any): Promise<any>;
}

export default class ProjectRecommendationEngine implements ProjectRecommendationEngineInterface {
  getRecommendations(data: any): Promise<any> {
    const { last_visited, project_id } = data;
    console.log(last_visited);
    console.log('project_id:', project_id);
    return new Promise((resolve: any) => {
      return resolve({
        recommended: ['test1', 'test2', 'test3', 'test4', 'test5'],
      });
    });
  }
}
