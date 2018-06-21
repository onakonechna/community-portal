import * as log4js from 'log4js';
const logger = log4js.getLogger();
log4js.configure({
    appenders: { 'out': { type: 'stdout' } },
    categories: { default: { appenders: ['out'], level: 'debug' } }
});

var config = require("./config.json");
var awsConfig = require("./aws-config.json");


import {GithubAPIInvoker} from './github/PullRequests';
import {PullRequestWriterDynamo} from './data/dynamo/PullRequestWriterDynamo'
import {Context} from './aws/Context'
import { mergeMap } from 'rxjs/operators';

const context = new Context(awsConfig);

//logger.debug("pr", PR)
const pullRequestsWriter = new PullRequestWriterDynamo(logger);

let pr = new GithubAPIInvoker(logger, config.github_token);
pr.addPRsListener(x => {
    logger.debug('pr', x.number)
    pullRequestsWriter.subscribe(x)
})
pr.retrieve()
    


/*pr.addCommitsListener(x => {logger.debug('commit', x.sha)})
pr.addCommitsBodyListener(x => {logger.debug(x.author ? x.author.login : x.commit.author.name)})
pr.retrieve()*/



// assign listeners to PRs
// assign listeners to commits
// assign listeners to commits, etc