interface ProjectTrafficControllerInterface {
  getLastVisited(data: any): (result: any) => any;
  recordProjectView(data: any): (result: any) => any;
}

export default class ProjectTrafficController implements ProjectTrafficControllerInterface {
  
  // intermediary controllers

  // special controllers
  null(data: any) {
    return (result: any) => {};
  }

}
