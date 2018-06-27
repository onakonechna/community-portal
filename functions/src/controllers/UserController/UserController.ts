interface UserControllerInterface {
  create(data: any): (result: any) => any;
  getById(data: any): (result: any) => any;
  update(data: any): (result: any) => any;
  delete(data: any): (result: any) => any;
  addUpvotedProject(data: any): (result: any) => any;
}

export default class UserController implements UserControllerInterface {
  create(data: any) {
    const { user_id } = data;
    return (result: any) => {
      return {
        status: 200,
        payload: {
          user_id,
          message: 'User created successfully',
        },
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

  update(data: any) {
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

  // Controllers for intermediaries

  addUpvotedProject(data: any) {
    return (result: any) => { return {}; };
  }

  removeUpvotedProject(data: any) {
    return (result: any) => { return {}; };
  }
}
