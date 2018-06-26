const IS_OFFLINE = process.env.IS_OFFLINE;
const PROJECTS_TABLE = process.env.PROJECTS_TABLE;
const PROJECTS_INDEX = process.env.PROJECTS_INDEX;

import { DynamoDB } from 'aws-sdk';

export default class Dynamodb {
  private client: DynamoDB.DocumentClient;

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

  createProject(data: any) {
    // append additional data
    const unixTimestamp = new Date().getTime();
    data.status = 'open';
    data.upvotes = 0;
    data.created = unixTimestamp;
    data.updated = unixTimestamp;

    const params = {
      TableName: PROJECTS_TABLE,
      Item: data,
    };
    return this.client.put(params).promise();
  }

  getProjectCards(data: Object) {
    const params = {
      TableName: PROJECTS_TABLE,
      IndexName: PROJECTS_INDEX,
      KeyConditionExpression: '#status = :status',
      ExpressionAttributeNames: {
        '#status': 'status',
      },
      ExpressionAttributeValues: {
        ':status': 'open',
      },
      ScanIndexForward: false,
      Limit: 10,
    };
    return this.client.query(params).promise();
  }

  getProjectDetails(data: Object) {
    const params = {
      TableName: PROJECTS_TABLE,
      Key: data,
    };
    return this.client.get(params).promise();
  }

  updateProjectStatus(data: any) {
    const params = {
      TableName: PROJECTS_TABLE,
      Key: {
        project_id: data.project_id,
      },
      AttributeUpdates: {
        status: {
          Action: 'PUT',
          Value: data.status,
        },
      },
    };
    return this.client.update(params).promise();
  }

  likeProject(data: Object) {
    const params = {
      TableName: PROJECTS_TABLE,
      Key: data,
      AttributeUpdates: {
        upvotes: {
          Action: 'ADD',
          Value: 1,
        },
      },
    };
    return this.client.update(params).promise();
  }
}
