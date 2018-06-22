import { DynamoDB } from 'aws-sdk';

import * as _ from 'lodash';
import AdapterInterface from './AdapterInterface';

export default class DatabaseAdapter implements AdapterInterface {
  private client: DynamoDB.DocumentClient;

  constructor(db: DatabaseConnection) {
    this.db = db.connect();
  }

  create(tableName: string, data: any): Promise<any> {
    const params = {
      TableName: tableName,
      Item: data,
    };
    return this.db.put(params).promise();
  }

  get(
    tableName: string,
    indexName: string,
    expression: string,
    nameMap: any = undefined,
    valueMap: any = undefined,
    ascending: boolean = true,
  ): Promise<any> {

    const params = {
      TableName: tableName,
      IndexName: indexName,
      KeyConditionExpression: expression,
      ExpressionAttributeNames: nameMap,
      ExpressionAttributeValues: valueMap,
      ScanIndexForward: ascending
    };
    return this.db.query(params).promise();

  }

  getById(tableName: string, identifier: any): Promise<any> {
    const params = {
      TableName: tableName,
      Key: identifier,
    };
    return this.db.get(params).promise();
  }

  update(tableName: string, identifier: any, data: any): Promise<any> {
    let AttributeUpdates: any = {};

    _.forOwn(data, (value: any, key: string) => {
      AttributeUpdates[key] = {
        Action: 'PUT',
        Value: value
      }
    });

    const params = {
      AttributeUpdates,
      TableName: tableName,
      Key: identifier,
    };
    return this.db.update(params).promise();
  }

  add(tableName: string, identifier: any, field: string, increment: number): Promise<any> {
    let AttributeUpdates = {};
    AttributeUpdates[field] = {
      Action: 'ADD',
      Value: increment,
    }

    const params = {
      AttributeUpdates,
      TableName: tableName,
      Key: identifier,
    };
    return this.db.update(params).promise();
  }

  delete(tableName: string, identifier: any): Promise<any> {
    const params = {
      TableName: PROJECTS_TABLE,
      Key: identifier,
    };
    return this.db.delete(params).promise();
  }
}
