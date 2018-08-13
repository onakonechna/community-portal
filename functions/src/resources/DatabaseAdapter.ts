import { DynamoDB } from 'aws-sdk';

import * as _ from 'lodash';
import AdapterInterface from './AdapterInterface';
import DatabaseConnection from './DatabaseConnection';

// convert identifier object to include DynamoDB string type
function convertIdentifier(identifier: any): any {
  const Key: any = {};
  _.forEach(identifier, (value: string, key: string) => {
    Key[key] = {
      S: value,
    };
  });
  return Key;
}

// this function is used in checking if an entry exists
// we only use either partition key or sort key for attribute_exists()
// because the database operation will find the entry first
// which means if the entry does not exist, neither partition key
// nor sort key will exist
function getSingleKey(identifier: any): any {
  for (const key in identifier) return key;
}

function getExistenceCondition(identifier: any) {
  return `attribute_exists(${getSingleKey(identifier)})`;
}

export default class DatabaseAdapter implements AdapterInterface {
  private db: DynamoDB.DocumentClient;
  private base: DynamoDB;

  // baseConnect is used for unsupported operations in the minified version
  constructor(db: DatabaseConnection) {
    this.db = db.connect();
    this.base = db.baseConnect();
  }

  // dynamodb only recognize NONE or ALL_OLD for the ReturnValues of PutItem
  create(tableName: string, data: any, returnValues: string = 'ALL_OLD'): Promise<any> {
    const params = {
      TableName: tableName,
      Item: data,
      ReturnValues: returnValues,
    };
    return this.db.put(params).promise();
  }

  get(
    tableName: string,
    key: string,
    value: string | number,
    indexName: string = undefined,
    ascending: boolean = true,
    limit: number = undefined,
    projectionExpression: string = undefined,
  ): Promise<any> {

    const params = {
      TableName: tableName,
      IndexName: indexName,
      KeyConditionExpression: '#KEY = :value',
      ExpressionAttributeNames: { '#KEY': key },
      ExpressionAttributeValues: { ':value': value },
      ScanIndexForward: ascending,
      Limit: limit,
      ProjectionExpression: projectionExpression,
    };
    return this.db.query(params).promise();

  }

  getById(
    tableName: string,
    identifier: any,
    projectionExpression: string = undefined,
  ): Promise<any> {
    const params = {
      TableName: tableName,
      Key: identifier,
      ProjectionExpression: projectionExpression,
    };
    return this.db.get(params).promise();
  }

  update(
    tableName: string,
    identifier: any,
    data: any,
    returnValues: string = 'ALL_NEW',
  ): Promise<any> {
    const AttributeUpdates: any = {};

    _.forOwn(data, (value: any, key: string) => {
      AttributeUpdates[key] = {
        Action: 'PUT',
        Value: value,
      };
    });

    const params = {
      AttributeUpdates,
      TableName: tableName,
      Key: identifier,
      ReturnValues: returnValues,
    };
    return this.db.update(params).promise();
  }

  add(
    tableName: string,
    identifier: any,
    field: string,
    increment: number,
    returnValues: string = 'ALL_NEW',
  ): Promise<any> {
    const AttributeUpdates: any = {};
    AttributeUpdates[field] = {
      Action: 'ADD',
      Value: increment,
    };

    const params = {
      AttributeUpdates,
      TableName: tableName,
      Key: identifier,
      ReturnValues: returnValues,
    };

    return this.db.update(params).promise();
  }

  addToSetIfNotExists(
    tableName: string,
    identifier: any,
    setName: string,
    item: string,
    returnValues: string = 'ALL_NEW',
  ) {
    const Key = convertIdentifier(identifier);
    const existenceCondition = getExistenceCondition(identifier);
    const setCondition = 'not(contains(#SET_NAME, :item))';
    const params = {
      Key,
      ExpressionAttributeNames: {
        '#SET_NAME': setName,
      },
      ExpressionAttributeValues: {
        ':item': { S: item },
        ':items': { SS: [item] },
      },
      ReturnValues: returnValues,
      TableName: tableName,
      UpdateExpression: 'ADD #SET_NAME :items',
      ConditionExpression: `${existenceCondition} AND ${setCondition}`,
    };

    return this.base.updateItem(params).promise();
  }

  addNestedObjToSet(
    tableName: string,
    identifier: any,
    setName: string,
    item: any,
    returnValues: string = 'ALL_NEW',
  ) {
    const Key = convertIdentifier(identifier);
    // const existenceCondition = getExistenceCondition(identifier);
    const setCondition = 'not(contains(#SET_NAME, :contribution))';
    const params = {
      Key,
      ExpressionAttributeNames: {
        '#SET_NAME': setName,
      },
      ExpressionAttributeValues: {
        ':contribution': {
          L: [
            {
              M: {
                ':time': { S: item.time },
                ':merged': { BOOL: item.merged },
                ':project': { S: item.project },
              },
            },
          ],
        },
        ':new_list': {
          L: [] as any,
        },
      },
      ReturnValues: returnValues,
      TableName: tableName,
      // tslint:disable-next-line:max-line-length
      UpdateExpression: 'SET #SET_NAME = list_append(if_not_exists(#SET_NAME, :new_list), :contribution)',
      ConditionExpression: setCondition,
    };

    return this.base.updateItem(params).promise();
  }

  addToSet(
    tableName: string,
    identifier: any,
    setName: string,
    item: string,
    returnValues: string = 'ALL_NEW',
  ) {
    const Key = convertIdentifier(identifier);
    const params = {
      Key,
      ExpressionAttributeNames: {
        '#SET_NAME': setName,
      },
      ExpressionAttributeValues: {
        ':items': { SS: [item] },
      },
      ReturnValues: returnValues,
      TableName: tableName,
      UpdateExpression: 'ADD #SET_NAME :items',
      ConditionExpression: getExistenceCondition(identifier),
    };

    return this.base.updateItem(params).promise();
  }

  removeFromSetIfExists(
    tableName: string,
    identifier: any,
    setName: string,
    item: string,
    returnValues: string = 'ALL_OLD',
  ) {
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
      ReturnValues: returnValues,
      TableName: tableName,
      UpdateExpression: 'DELETE #SET_NAME :items',
      ConditionExpression: `${getExistenceCondition(identifier)} AND contains(#SET_NAME, :item)`,
    };

    return this.base.updateItem(params).promise();
  }

  removeFromSet(
    tableName: string,
    identifier: any,
    setName: string,
    item: string,
    returnValues: string = 'ALL_OLD',
  ) {
    const Key = convertIdentifier(identifier);
    const params = {
      Key,
      ExpressionAttributeNames: {
        '#SET_NAME': setName,
      },
      ExpressionAttributeValues: {
        ':items': { SS: [item] },
      },
      ReturnValues: returnValues,
      TableName: tableName,
      UpdateExpression: 'DELETE #SET_NAME :items',
      ConditionExpression: getExistenceCondition(identifier),
    };

    return this.base.updateItem(params).promise();
  }

  incrementMapKey(
    tableName: string,
    identifier: any,
    mapName: string,
    key: string,
    value: string | number,
    returnValues: string = 'ALL_NEW',
  ) {
    const params = {
      TableName: tableName,
      Key: identifier,
      UpdateExpression: 'ADD #MAP_NAME.#KEY :value',
      ExpressionAttributeNames: {
        '#MAP_NAME': mapName,
        '#KEY': key,
      },
      ExpressionAttributeValues: {
        ':value': value,
      },
      ReturnValues: returnValues,
      ConditionExpression: getExistenceCondition(identifier),
    };

    return this.db.update(params).promise();
  }

  addToMap(
    tableName: string,
    identifier: any,
    mapName: string,
    key: string,
    value: string | number,
    returnValues: string = 'ALL_NEW',
  ) {
    const params = {
      TableName: tableName,
      Key: identifier,
      UpdateExpression: 'SET #MAP_NAME.#KEY = :value',
      ExpressionAttributeNames: {
        '#MAP_NAME': mapName,
        '#KEY': key,
      },
      ExpressionAttributeValues: {
        ':value': value,
      },
      ReturnValues: returnValues,
      ConditionExpression: getExistenceCondition(identifier),
    };

    return this.db.update(params).promise();
  }

  delete(tableName: string, identifier: any, returnValues: string = 'ALL_OLD'): Promise<any> {
    const params = {
      TableName: tableName,
      Key: identifier,
      ReturnValues: returnValues,
    };
    return this.db.delete(params).promise();
  }
}
