interface ProjectTrafficControllerInterface {
  getRecommendations(data: any): (result: any) => any;
}

export default class ProjectTrafficController implements ProjectTrafficControllerInterface {

  // intermediary controllers

  // special controllers
  getRecommendations(data: any) {
    return (result: any) => {
      const { recommended } = result;
      return { recommended };
    };
  }

}
