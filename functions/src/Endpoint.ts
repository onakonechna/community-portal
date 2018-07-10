import * as express from 'express';
import { Request, Response } from './../config/Types';

import * as cors from 'cors';
import * as bodyParser from 'body-parser';

const serverless = require('serverless-http');

const corsOptions = {
  origin: '*',
  methods: 'GET,PUT,POST,DELETE',
  preflightContinue: false,
  optionsSuccessStatus: 204,
};

interface CustomizedRequest {
  authorizationContext: any;
}

export default class Endpoint {
  private url: string;
  private method: string;
  private app: any;

  constructor(url: string, method: string) {
    this.url = url;
    this.method = method;
    this.app = express();
    this.app.use(cors(corsOptions));
    this.app.use(bodyParser.json({ strict: false }));
  }

  getMethod() {
    return this.method;
  }

  configure(execute: (req: Request, res: Response) => any) {
    this.app[this.method](this.url, (req: Request, res: Response) => {
      execute(req, res);
    });
  }

  wrap() {
    return serverless(this.app, {
      request(request: Request, event: any, context: any) {
        if (event.requestContext.authorizer !== undefined) {
          if (event.requestContext.authorizer.claims !== undefined) {
            request.tokenContents = event.requestContext.authorizer.claims;
          } else {
            request.tokenContents = event.requestContext.authorizer;
          }
        }
      },
    });
  }
}
