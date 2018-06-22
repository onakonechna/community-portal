import * as _ from 'lodash';
import DatabaseConnection from './../DatabaseConnection';
import ResourceInterface from './../resourceInterface';

const PROJECTS_TABLE = process.env.PROJECTS_TABLE;
const PROJECTS_INDEX = process.env.PROJECTS_INDEX;

interface ProjectResourceInterface extends ResourceInterface {
  updateStatus(data: any): Promise<any>;
  upvote(data: any): Promise<any>;
}

export default class ProjectResource implements ProjectResourceInterface {

  constructor(db: DatabaseConnection) {
    this.db = db;
  }

  create(data: any): Promise<any> {
    // append additional data
    const unixTimestamp = new Date().getTime();
    data.status = 'open';
    data.upvotes = 0;
    data.created = unixTimestamp;
    data.updated = unixTimestamp;
    data.completed = 0;

    const params = {
      TableName: PROJECTS_TABLE,
      Item: data,
    };
    return this.db.connect().put(params).promise();
  }

  get(data: any): Promise<any> {
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
      ScanIndexForward: false
    };
    return this.db.connect().query(params).promise();
  }

  getById(data: any): Promise<any> {
    const params = {
      TableName: PROJECTS_TABLE,
      Key: data,
    };
    return this.db.connect().get(params).promise();
  }

  update(data: any): Promise<any> {
    const { project_id } = data;
    delete data['project_id'];

    let AttributeUpdates: any = {};

    _.forOwn(data, (value: any, key: string) => {
      AttributeUpdates[key] = {
        Action: 'PUT',
        Value: value
      }
    });

    const params = {
      AttributeUpdates,
      TableName: PROJECTS_TABLE,
      Key: {
        project_id
      },
    };
    return this.db.connect().update(params).promise();
  }

  updateStatus(data: any): Promise<any> {
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
    return this.db.connect().update(params).promise();
  }

  upvote(data: any): Promise<any> {
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
    return this.db.connect().update(params).promise();
  }

  delete(data: any): Promise<any> {
    const params = {
      TableName: PROJECTS_TABLE,
      Key: data,
    };
    return this.db.connect().delete(params).promise();
  }
}
