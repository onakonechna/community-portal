interface ProjectControllerInterface {
  create(data: any): (result: any) => any;
  getCards(data: any): (result: any) => any;
  getById(data: any): (result: any) => any;
  edit(data: any): (result: any) => any;
  updateDisplay(data: any): (result: any) => any;
  delete(data: any): (result: any) => any;
  updateStatus(data: any): (result: any) => any;
  checkOwner(data: any): (result: any) => any;
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
        payload: { error: 'No project found' },
      };
    };
  }

  getById(data: any) {
    return (result: any) => {
      if (result.Item) {
        return {
          status: 200,
          payload: result.Item,
        };
      }
      return {
        status: 404,
        payload: { error: 'Project not found' },
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

  getProjectUpvotes(data:any) {
    return (result:any) => {
      return {
        status: 200,
        payload: {
          data
        },
      }
    }
  }

  updateDisplay(data: any) {
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

  // intermediary controllers

  updateStatus(data: any) {
    // display == true only if status == open after update
    return (result: any) => {
      const { status } = result.Attributes;
      return {
        display: String(status === 'open'),
      };
    };
  }

  // check if user is owner of project
  checkOwner(data: any) {
    const { user_id } = data;
    return (result: any) => {
      const flag = { is_owner: false };
      if (result.Item && result.Item.owner === user_id) {
        flag.is_owner = true;
      }
      return flag;
    };
  }
}
