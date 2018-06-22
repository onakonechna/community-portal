import ControllerInterface from './ControllerInterface';

export default class ControllerFactory {
  private config: any;

  constructor(config: any) {
    this.config = config;
  }

  create(type: string): ControllerInterface {
    const location = this.config[type];
    const controller = require(location);

    return new controller();
  }
}
