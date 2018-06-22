import ControllerBase from './../ControllerBase';
import { ControllerInterface, ControllerHandlers } from './../ControllerInterface';

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
