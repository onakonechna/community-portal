import { DynamoDB } from 'aws-sdk';

import * as _ from 'lodash';
import AdapterInterface from './AdapterInterface';
import DatabaseConnection from './DatabaseConnection';

// convert identifier object to include DynamoDB string type
function convertIdentifier(identifier: any): any {
  let Key: any = {};
  _.forEach(identifier, (value: string, key: string) => {
    Key[key] = {
      S: value,
    };
  });
  return Key;
}

export default class DatabaseAdapter implements AdapterInterface {
  private db: DynamoDB.DocumentClient;
  private base: DynamoDB;

  // baseConnect is used for unsupported operations in the minified version
  constructor(db: DatabaseConnection) {
    this.db = db.connect();
    this.base = db.baseConnect();
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
    let AttributeUpdates: any = {};
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

  // use string sets
  // identifier is of string type
  // add to set only if item does not already exist
  addToSet(tableName: string, identifier: any, setName: string, item: string) {
    const Key = convertIdentifier(identifier);
    const params = {
      Key,
      ExpressionAttributeNames: {
        '#SET_NAME': setName,
      },
      ExpressionAttributeValues: {
        ':item': { S: item },
        ':items': { SS: [item] },
      },
      ReturnValues: 'ALL_NEW',
      TableName: tableName,
      UpdateExpression: 'ADD #SET_NAME :items',
      ConditionExpression: 'not(contains(#SET_NAME, :item))',
    };

    return this.base.updateItem(params).promise();
  }

  removeFromSet(tableName: string, identifier: any, setName: string, item: string) {
    const Key = convertIdentifier(identifier);
    const params = {
      Key,
      ExpressionAttributeNames: {
        '#SET_NAME': setName,
      },
      ExpressionAttributeValues: {
        ':item': { S: item },
        ':items': { SS: [item] },
      },
      ReturnValues: 'ALL_NEW',
      TableName: tableName,
      UpdateExpression: 'DELETE #SET_NAME :items',
      ConditionExpression: 'contains(#SET_NAME, :item)',
    };

    return this.base.updateItem(params).promise();
  }

  delete(tableName: string, identifier: any): Promise<any> {
    const params = {
      TableName: tableName,
      Key: identifier,
    };
    return this.db.delete(params).promise();
  }
}
