import { DynamoDB } from 'aws-sdk';

const IS_OFFLINE = process.env.IS_OFFLINE;

export default class DatabaseConnection {

  constructor() {}

  connect() {
    if (IS_OFFLINE === 'true') {
      return new DynamoDB.DocumentClient({
        region: 'localhost',
        endpoint: 'http://localhost:8000',
      });
    } else {
      return new DynamoDB.DocumentClient();
    }
  }

  baseConnect() {
    if (IS_OFFLINE === 'true') {
      return new DynamoDB({
        region: 'localhost',
        endpoint: 'http://localhost:8000',
      });
    } else {
      return new DynamoDB();
    }
  }
}
