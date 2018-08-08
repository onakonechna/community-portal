interface ProjectTrafficControllerInterface {
  getRecommendations(data: any): (result: any) => any;
}

export default class ProjectRecommendationController implements ProjectTrafficControllerInterface {

  // intermediary controllers
  getRecommendations(data: any) {
    return (result: any) => {
      // const { recommended } = JSON.parse(result.Body.toString());
      const { recommended } = result;
      return { recommended };
    };
  }

  // special controllers
  null(data: any) {
    return (result: any) => {};
  }

}
