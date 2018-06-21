export default class DBConnectionFactory {
  private config: any;

  constructor(config: any) {
    this.config = config;
  }

  create(type: string) {
    const location = this.config[type];
    const DBConnection = require(location);

    return new DBConnection();
  }
}
