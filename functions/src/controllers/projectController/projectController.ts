import BaseController from './../baseController';
import { ControllerInterface, ControllerHandlers } from './../controllerInterface';

interface ProjectControllerInterface extends ResourceInterface {

}



export default class ProjectController extends BaseController implements ProjectControllerInterface {

  resolve(request: Promise<any>): {status: number, payload: any} {

  }
}
