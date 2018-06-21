import {DynamoDB} from 'aws-sdk/clients/all'
import * as uuid from 'uuid'
import { Observable, Observer, Subject, ReplaySubject, from, of, range} from 'rxjs';
import {Logger} from 'log4js';
import * as PullRequestsDb from './setup/PullRequestsTable'

export class PullRequestWriterDynamo {

    client: DynamoDB.DocumentClient
    dynamodb: DynamoDB
    logger: Logger

    constructor(logger: Logger) {
        this.client = new DynamoDB.DocumentClient();
        this.logger = logger
    }

    subscribe(pr) {
        //this.logger.debug(pr)
        const createdDate = new Date(pr.created_at)
        const mergedDate = pr.merged_at ? new Date(pr.merged_at) : null
        const yearStart = new Date(Date.UTC(createdDate.getUTCFullYear(), 0, 1));
        const createdWeek = Math.ceil((((createdDate - yearStart) / 86400000) + 1)/7);
        const mergedWeek = mergedDate ? Math.ceil((((mergedDate - yearStart) / 86400000) + 1)/7) : null;
        const params = {
            TableName: PullRequestsDb.TableName,
            Item: {
                id: pr.id,
                number: pr.number,
                state: pr.state,
                title: pr.title,
                author_id: pr.user.id,
                created_year: createdDate.getFullYear(),
                created_month: createdDate.getMonth(),
                created_week: createdWeek,
                merged_year: mergedDate ? mergedDate.getFullYear() : null,
                merged_month: mergedDate ? mergedDate.getMonth() : null,
                merged_week: mergedWeek ? mergedDate : null,
                user: {
                    login: pr.user.login,
                    id: pr.user.id,
                },
                created_at: pr.created_at,
                updated_at: pr.updated_at,
                closed_at: pr.closed_at,
                merged_at: pr.merged_at,
                labels: pr.labels,
                head: {
                    login: pr.head.user.login,
                    repo: pr.head.repo.full_name,
                    name: pr.head.repo.name
                },
                base: {
                    login: pr.base.user.login,
                    repo: pr.base.repo.full_name,
                    name: pr.base.repo.name
                }
            }    
          }

          
        
          // write the todo to the database
        return from(this.client.put(params, (error, result) => {
            // handle potential errors
            if (error) {
              console.error(error)
              return
            }
            this.logger.debug(result)
          }).promise())
    }

    subscribeUpdatedPr(pr) {
        this.dynamodb.updateItem(
            {
              TableName: 'pull-request-per-period',
              Key: periodValue,
              UpdateExpression: 'ADD Price = Price + :incr',
              ConditionExpression: {

              },
              ExpressionAttributeValues: {
                  ":incr": {"N": 1}
              }
            }
        );
    }

}