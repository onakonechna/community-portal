interface ProjectTrafficControllerInterface {
  getRecommendations(data: any): (result: any) => any;
}

export default class ProjectRecommendationController implements ProjectTrafficControllerInterface {

  // intermediary controllers
  getRecommendations(data: any) {
    return (result: any) => {
      const { recommended } = JSON.parse(result.Body.toString());
      return { recommended };
    };
  }

  // special controllers

}
