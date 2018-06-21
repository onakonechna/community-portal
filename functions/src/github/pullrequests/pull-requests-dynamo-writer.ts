import {DynamoDB} from 'aws-sdk/clients/all'
import * as uuid from 'uuid'
import { Observable, Observer, Subject, ReplaySubject, from, of, range} from 'rxjs';
//import {Logger} from 'log4js';
import * as Github from '@octokit/rest'

const resources = require('../../resources/github-pull-requests-table.json');



export class PullRequestWriterDynamo {

    client: DynamoDB.DocumentClient
    dynamodb: DynamoDB
    //logger: Logger

    constructor(/*logger: Logger*/) {
        this.client = new DynamoDB.DocumentClient();
        //this.logger = logger
    }

    subscribe(pr: PullRequest.PullRequest) {
        //this.logger.debug(pr)
        const createdDate = new Date(pr.created_at)
        const mergedDate = pr.merged_at ? new Date(pr.merged_at) : null
        const yearStart = new Date(Date.UTC(createdDate.getUTCFullYear(), 0, 1));
        const fromStartOfTheYearToCreated = createdDate.valueOf() - yearStart.valueOf();
        const createdWeek = Math.ceil((((fromStartOfTheYearToCreated) / 86400000) + 1)/7);
        
        const fromStartOfTheYearToMerged = mergedDate.valueOf() - yearStart.valueOf();
        const mergedWeek = mergedDate ? Math.ceil((((fromStartOfTheYearToMerged) / 86400000) + 1)/7) : null;
        const params = {
            TableName: resources.PullRequestsTable.TableName,
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
            //this.logger.debug(result)
          }).promise())
    }

    subscribeUpdatedPr(pr: PullRequest.PullRequest) {
        // const tableName: DynamoDB.TableName = resources.tables.github_prs_per_period;
        // this.dynamodb.updateItem({
        //       TableName: tableName,
        //       Key: periodValue,
        //       UpdateExpression: 'ADD Price = Price + :incr',
        //       ConditionExpression: {

        //       },
        //       ExpressionAttributeValues: {
        //           ":incr": {"N": 1}
        //       }
        //     }
        // );
    }
}