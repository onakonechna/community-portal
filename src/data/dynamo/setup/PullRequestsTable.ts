import {DynamoDB} from 'aws-sdk/clients/all'
import * as uuid from 'uuid'
import { Observable, Observer, Subject, ReplaySubject, from, of, range} from 'rxjs';
import {Logger} from 'log4js';

export const TableName: String = "pull_requests";

export class PullRequestTable {

    client: DynamoDB
    logger: Logger
    

    constructor(logger: Logger) {
        this.client = new DynamoDB();
        this.logger = logger
    }

    createTable()
    {
        this.client.listTables
        var params = {
            AttributeDefinitions: [
              {
                AttributeName: 'id',
                AttributeType: 'N'
              },
            ],
            KeySchema: [
              {
                AttributeName: 'id',
                KeyType: 'HASH'
              },
            ],
            ProvisionedThroughput: {
              ReadCapacityUnits: 1,
              WriteCapacityUnits: 1
            },
            TableName: TableName,
            StreamSpecification: {
              StreamEnabled: false
            }
          };
        return from(this.client.createTable(params).promise())
    }
}