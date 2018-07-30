import * as express from 'express';
import * as _ from 'lodash';
import { Callback, Request, Response } from './../config/Types';
import { CustomAuthorizerEvent, APIGatewayEventRequestContext } from 'aws-lambda';
import PackageService from './services/PackageService';

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
  private router: any;
  private packageService: PackageService;

  constructor(url: string, method: string, packageService: PackageService) {
    this.url = url;
    this.method = method;
    this.app = express();
    this.router = express.Router();
    this.app.use(cors(corsOptions));
    this.app.use(bodyParser.json({ strict: false }));
    this.packageService = packageService;

    this.configure();
  }

  getMethod() {
    return this.method;
  }

  configure() {
    this.router[this.method](this.url, (req: Request, res: Response) => {
      const initialData = _.assign(req.query, req.params, req.body);
      const callback = (response: any) => {
        res.status(response.status).json(response.payload);
      };
      this.packageService.package(initialData, callback, callback, req.tokenContents);
    });
    this.app.use(process.env.BASE_PATH, this.router);
  }

  execute() {
    const handler = serverless(this.app, {
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

    return (
      event: CustomAuthorizerEvent,
      context: APIGatewayEventRequestContext,
      callback: Callback,
    ) => handler(event, context, callback);
  }
}
