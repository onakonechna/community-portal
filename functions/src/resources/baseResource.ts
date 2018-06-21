import { DynamoDB } from 'aws-sdk';

const IS_OFFLINE = process.env.IS_OFFLINE;

export default class baseResource {
  protected client: DynamoDB.DocumentClient;

  constructor() {
    if (IS_OFFLINE === 'true') {
      this.client = new DynamoDB.DocumentClient({
        region: 'localhost',
        endpoint: 'http://localhost:8000',
      });
    } else {
      this.client = new DynamoDB.DocumentClient();
    }
  }
}
