interface ProjectControllerInterface {
  create(data: any): (result: any) => any;
  getCards(data: any): (result: any) => any;
  getById(data: any): (result: any) => any;
  edit(data: any): (result: any) => any;
  updateStatus(data: any): (result: any) => any;
  upvote(data: any): (result: any) => any;
  downvote(data: any): (result: any) => any;
  delete(data: any): (result: any) => any;
  addSubscriber(data: any): (result: any) => any;
}

export default class ProjectController implements ProjectControllerInterface {
  create(data: any) {
    const { project_id } = data;
    return (result: any) => {
      return {
        status: 200,
        payload: {
          project_id,
          message: 'Project created successfully',
        },
      };
    };
  }

  getCards(data: any) {
    return (result: any) => {
      if (result.Items) {
        return {
          status: 200,
          payload: result.Items,
        };
      }
      return {
        status: 404,
        payload: { 'error': 'No project found' },
      };
    };
  }

  getById(data: any) {
    const { project_id } = data;
    return (result: any) => {
      if (result.Item) {
        return {
          status: 200,
          payload: result.Item,
        };
      }
      return {
        status: 404,
        payload: { 'error': 'Project not found' },
      };
    };
  }

  edit(data: any) {
    const { project_id } = data;
    return (result: any) => {
      return {
        status: 200,
        payload: {
          project_id,
          message: 'Project edited successfully',
        },
      };
    };
  }

  updateStatus(data: any) {
    const { project_id } = data;
    return (result: any) => {
      return {
        status: 200,
        payload: {
          project_id,
          message: 'Project status updated successfully',
        },
      };
    };
  }

  upvote(data: any) {
    const { project_id } = data;
    return (result: any) => {
      return {
        status: 200,
        payload: {
          project_id,
          message: 'Project upvoted successfully',
        },
      };
    };
  }

  downvote(data: any) {
    const { project_id } = data;
    return (result: any) => {
      return {
        status: 200,
        payload: {
          project_id,
          message: 'Project downvoted successfully',
        },
      };
    };
  }

  delete(data: any) {
    const { project_id } = data;
    return (result: any) => {
      return {
        status: 200,
        payload: {
          project_id,
          message: 'Project deleted successfully',
        },
      };
    };
  }

  addSubscriber(data: any) {
    return (result: any) => { return {}; };
  }

  removeSubscriber(data: any) {
    return (result: any) => { return {}; };
  }
}
