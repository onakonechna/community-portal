import AuthorizationService from './../../services/AuthorizationService';

const authroizationService = new AuthorizationService();

interface UserControllerInterface {
  create(data: any): (result: any) => any;
  getById(data: any): (result: any) => any;
  update(data: any): (result: any) => any;
  delete(data: any): (result: any) => any;
  checkExistence(data: any): (result: any) => any;
  getScopes(data: any): (result: any) => any;
}

function deleteField(object: any, field: string) {
  delete object[field];
  return object;
}

export default class UserController implements UserControllerInterface {
  create(data: any) {
    delete data['user_exists'];
    delete data['access_token'];

    const { user_id, scopes } = data;
    return (result: any) => {
      return {
        status: 200,
        payload: {
          user_id,
          scopes,
          message: 'User saved',
          token: authroizationService.create(data),
        },
      };
    };
  }

  getById(data: any) {
    return (result: any) => {
      if (result.Item) {
        return {
          status: 200,
          payload: deleteField(result.Item, 'access_token'),
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

  checkExistence(data: any) {
    return (result: any) => {
      const flag = { user_exists: false };
      if (result.Item) {
        flag.user_exists = true;
      }
      return flag;
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
      console.log('Warning: User not found - attempt to retrieve user scopes gives empty map');
      return {};
    };
  }

}
