interface ProjectTrafficControllerInterface {
  getLastVisited(data: any): (result: any) => any;
  null(data: any): (result: any) => any;
}

export default class ProjectTrafficController implements ProjectTrafficControllerInterface {

  getLastVisited(data: any) {
    return (result: any) => ({ last_visited: result.Items ? result.Items : [] });
  }

  // intermediary controllers

  // special controllers
  null(data: any) {
    return (result: any) => {};
  }

}
