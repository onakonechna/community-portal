interface ProjectTrafficControllerInterface {
  getRecommendations(data: any): (result: any) => any;
}

export default class ProjectRecommendationController implements ProjectTrafficControllerInterface {

  // intermediary controllers
  getModel(data: any) {
    return (result: any) => {
      const { model } = JSON.parse(result.Body.toString());
      return { model };
    };
  }
  getRecommendations(data: any) {
    return (result: any) => {
      const { recommended } = result;
      return { recommended };
    };
  }

  // special controllers
  null(data: any) {
    return (result: any) => {};
  }

}
