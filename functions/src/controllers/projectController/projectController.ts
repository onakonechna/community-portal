import { ControllerInterface, ControllerHandlers } from './../ControllerInterface';
import Validator from './../../Validator';

interface ProjectControllerInterface {
  create(data: any): ControllerHandlers;
  getProjectCards(data: any): ControllerHandlers;
  getById(data: any): ControllerHandlers;
  update(data: any): ControllerHandlers;
  updateStatus(data: any): ControllerHandlers;
  upvote(data: any): ControllerHandlers;
  delete(data: any): ControllerHandlers;
}

const terminate = (error: Error) => {
  return {
    status: 400,
    payload: { error },
  }
};

export default class ProjectController implements ProjectControllerInterface {
  create(data: any) {
    const { project_id } = data;
    const transform = (result: any) => {
      return {
        status: 200,
        payload: {
          project_id,
          message: 'Project created successfully',
        },
      };
    };
    return { transform, terminate };
  }

  getProjectCards(data: any) {
    const transform = (result: any) => {
      if (result.Items) {
        return {
          status: 200,
          payload: result.Items,
        };
      }
      return [404, { error: 'No project found' }];
    };
    return { transform, terminate };
  }

  getById(data: any) {
    const { project_id } = data;
    const transform = (result: any) => {
      if (result.Item) {
        return {
          status: 200,
          payload: result.Item,
        };
      }
      return [404, { error: 'Project not found' }];
    };
    return { transform, terminate };
  }

  update(data: any) {
    const { project_id } = data;
    const transform = (result: any) => {
      return {
        status: 200,
        payload: {
          project_id,
          message: 'Project updated successfully',
        },
      };
    };
    return { transform, terminate };
  }

  updateStatus(data: any) {
    const { project_id } = data;
    const transform = (result: any) => {
      return {
        status: 200,
        payload: {
          project_id,
          message: 'Project updated successfully',
        },
      };
    };
    return { transform, terminate };
  }

  upvote(data: any) {
    const { project_id } = data;
    const transform = (result: any) => {
      return {
        status: 200,
        payload: {
          project_id,
          message: 'Project status updated successfully',
        },
      };
    };
    return { transform, terminate };
  }

  delete(data: any) {
    const { project_id } = data;
    const transform = (result: any) => {
      return {
        status: 200,
        payload: {
          project_id,
          message: 'Project deleted successfully',
        },
      };
    };
    return { transform, terminate };
  }
}
