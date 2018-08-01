interface ProjectTrafficControllerInterface {
  getLastVisited(data: any): (result: any) => any;
  null(data: any): (result: any) => any;
}

export default class ProjectTrafficController implements ProjectTrafficControllerInterface {

  getLastVisited(data: any) {
    return (result: any) => {
      if (result.Items) {
        return { last_visted: result.Items };
      }
      return { last_visited: [] };
    };
  }

  // intermediary controllers

  // special controllers
  null(data: any) {
    return (result: any) => {};
  }

}
