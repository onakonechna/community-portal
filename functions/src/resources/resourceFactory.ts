import ResourceInterface from './resourceInterface';

export default class ResourceFactory {
  private config: any;

  constructor(config: any) {
    this.config = config;
  }

  create(type: string): ResourceInterface {
    const location = this.config[type];
    const resource = require(location);

    return new resource();
  }
}
