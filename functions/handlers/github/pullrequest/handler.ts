import express = require('express');

const serverless = require('serverless-http');

const app = express();

var config = require("../../config.json");
var awsConfig = require("../../aws-config.json");


import {GithubAPIInvoker} from '../../../src/github/pullrequests/pull-requests';
import {PullRequestWriterDynamo} from '../../../src/github/pullrequests/pull-requests-dynamo-writer'
import {Context} from '../../../src/aws/Context'

const context = new Context(awsConfig);

//logger.debug("pr", {"test": "test"})
const pullRequestsWriter = new PullRequestWriterDynamo(/*logger*/);



module.exports.handler = app.get('/pull-requests/', (req:express.Request, res:express.Response) => {
    //console.log(req);
    let pr = new GithubAPIInvoker(/*logger, */config.github_token);
    pr.addPRsListener((x: any) => {
        console.log(x.number);
        //logger.debug('pr', x.number)
        pullRequestsWriter.subscribe(x)
    })
    
});

//module.exports.handler = pr.retrieve;//serverless(app);

export {}; // for TypeScript to recognize local scoping