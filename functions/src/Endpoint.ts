import * as express from 'express';

import * as serverless from 'serverless-http';
import * as cors from 'cors';
import * as bodyParser 'body-parser';

import { ControllerHandlers } from './../ControllerInterface';

const corsOptions = {
  "origin": "*",
  "methods": "GET,PUT,POST,DELETE",
  "preflightContinue": false,
  "optionsSuccessStatus": 204,
};

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

  configure(execute: (req: express.Request, res: express.Response) => any) {
    this.app[this.method](this.url, (req: express.Request, res: express.Response) => {
      execute(req, res);
    });
  }

  wrap(){
    return serverless(this.app);
  }
}
