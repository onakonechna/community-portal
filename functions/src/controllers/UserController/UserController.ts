import AuthorizationService from './../../services/AuthorizationService';

const authroizationService = new AuthorizationService();

interface UserControllerInterface {
  create(data: any): (result: any) => any;
  getById(data: any): (result: any) => any;
  update(data: any): (result: any) => any;
  delete(data: any): (result: any) => any;
  addUpvotedProject(data: any): (result: any) => any;
  removeUpvotedProject(data: any): (result: any) => any;
  pledge(data: any): (result: any) => any;
  subscribe(data: any): (result: any) => any;
  checkExistence(data: any): (result: any) => any;
  storeAvatarUrl(data: any): (result: any) => any;
  getScopes(data: any): (result: any) => any;
}

export default class UserController implements UserControllerInterface {
  create(data: any) {
    const data_copy = Object.assign({}, data);
    delete data_copy['user_exists'];
    delete data_copy['access_token'];

    const { user_id } = data;
    return (result: any) => {
      return {
        status: 200,
        payload: {
          user_id,
          message: 'User saved',
          token: authroizationService.create(data_copy),
        },
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
        payload: { error: 'User not found' },
      };
    };
  }

  update(data: any) {
    const { user_id } = data;
    return (result: any) => {
      return {
        status: 200,
        payload: {
          user_id,
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
        payload: { error: 'User not found' },
      };
    };
  }

  delete(data: any) {
    const { user_id } = data;
    return (result: any) => {
      return {
        status: 200,
        payload: {
          user_id,
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

  checkExistence(data: any) {
    return (result: any) => {
      const flag = { user_exists: false };
      if (result.Item) {
        flag.user_exists = true;
      }
      return flag;
    };
  }

  storeAvatarUrl(data: any) {
    return (result: any) => {
      if (result.Item) {
        const { avatar_url } = result.Item;
        return { avatar_url };
      }
      throw 'User not found. Attempt to retrieve user avatar_url failed';
    };
  }

  getScopes(data: any) {
    return (result: any) => {
      if (result.Item) {
        const { scopes } = result.Item;
        if (scopes === undefined) {
          return {}; // empty array
        }
        return { scopes: scopes.values };
      }
      throw 'User not found. Attempt to retrieve user scopes failed';
    };
  }

}
