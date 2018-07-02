interface UserControllerInterface {
  create(data: any): (result: any) => any;
  getById(data: any): (result: any) => any;
  update(data: any): (result: any) => any;
  delete(data: any): (result: any) => any;
  addUpvotedProject(data: any): (result: any) => any;
  removeUpvotedProject(data: any): (result: any) => any;
  pledge(data: any): (result: any) => any;
  subscribe(data: any): (result: any) => any;
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
        payload: { 'error': 'User not found' },
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
          message: 'User updated successfully',
        },
      };
    };
  }

  getUpvotedProjects(data: any) {
    return (result: any) => {
      if (result.Item) {
        const { user_id, upvoted_projects } = result.Item;
        return {
          status: 200,
          payload: {
            user_id,
            upvoted_projects: upvoted_projects.values,
          },
        };
      }
      return {
        status: 404,
        payload: { 'error': 'User not found' },
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

  pledge(data: any) {
    return (result: any) => {
      return {
        status: 200,
        payload: {
          result,
          message: 'Pledged successfully',
        },
      };
    };
  }

  subscribe(data: any) {
    return (result: any) => {
      return {
        status: 200,
        payload: {
          result,
          message: 'Subscribed successfully',
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
