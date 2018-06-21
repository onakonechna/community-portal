import * as log4js from 'log4js';
const logger = log4js.getLogger();
log4js.configure({
    appenders: { 'out': { type: 'stdout' } },
    categories: { default: { appenders: ['out'], level: 'debug' } }
});

var config = require("./config.json");
var awsConfig = require("./aws-config.json");

import {PullRequestTable} from './data/dynamo/setup/PullRequestsTable'
import {Context} from './aws/Context'

const context = new Context(awsConfig);

//logger.debug("pr", PR)
const pullRequestsWriter = new PullRequestTable(logger);
pullRequestsWriter.createTable().subscribe(
    result => logger.debug(result),
    e => {
        logger.error('error', e)
    }
)