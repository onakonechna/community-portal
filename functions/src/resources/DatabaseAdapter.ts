import { DynamoDB } from 'aws-sdk';

import AdapterInterface from './AdapterInterface';

export default class DatabaseConnection {
  private client: DynamoDB.DocumentClient;

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
}
