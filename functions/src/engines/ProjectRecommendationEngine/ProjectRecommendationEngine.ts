interface ProjectRecommendationEngineInterface {
  getRecommendations(data: any): Promise<any>;
}

export default class ProjectRecommendationEngine implements ProjectRecommendationEngineInterface {
  getRecommendations() {
    return new Promise((resolve: any) => {
      return resolve({
        recommended: ['test1', 'test2', 'test3', 'test4', 'test5'],
      });
    });
  }
}
