import { ControllerInterface, ControllerHandlers } from './../ControllerInterface';
import Validator from './../Validator';

interface ProjectControllerInterface {
  create(project_id: string): ControllerHandlers;
  get(): ControllerHandlers;
  getById(project_id: string): ControllerHandlers;
  update(project_id: string): ControllerHandlers;
  updateStatus(project_id: string): ControllerHandlers;
  upvote(project_id: string): ControllerHandlers;
  delete(project_id: string): ControllerHandlers;
}

const terminate = (error: Error) => {
  return {
    status: 400,
    payload: { error },
  }
};

export default class ProjectController implements ProjectControllerInterface {

  constructor(validationMap: any) {
    this.validationMap = validationMap;
  }

  create(project_id: string) {
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

  get() {
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

  getById() {
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

  update(project_id: string) {
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

  updateStatus(project_id: string) {
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

  upvote(project_id: string) {
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

  delete(project_id: string) {
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
