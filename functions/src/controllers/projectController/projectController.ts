import BaseController from './../baseController';
import { ControllerInterface, ControllerHandlers } from './../controllerInterface';

interface ProjectControllerInterface extends ResourceInterface {
  createProject(): ControllerHandlers;
}



export default class ProjectController extends BaseController implements ProjectControllerInterface {

  createProject(){
    const resolve = () => {

    };
    const reject = () => {

    };
    return { resolve, reject };
  }

  resolve(request: Promise<any>): {status: number, payload: any} {

  }
}
