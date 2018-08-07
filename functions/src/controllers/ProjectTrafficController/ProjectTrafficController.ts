interface ProjectTrafficControllerInterface {
  getLastVisited(data: any): (result: any) => any;
  null(data: any): (result: any) => any;
}

export default class ProjectTrafficController implements ProjectTrafficControllerInterface {

  getLastVisited(data: any) {
    return (result: any) => ({ last_visited: result.Items ? result.Items : [] });
  }

  scan(data: any) {
    return (result: any) => {
      if (result.Items) return { traffic: result.Items };
      throw 'No data found inside the project-traffic table';
    };
  }

  // intermediary controllers

  // special controllers
  null(data: any) {
    return (result: any) => {};
  }

}
