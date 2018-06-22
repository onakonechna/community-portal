import * as express from 'express';
import RequestHandler from './RequestHandler';

import * as serverless from 'serverless-http';
import * as cors from 'cors';
import * as bodyParser 'body-parser';

const corsOptions = {
  "origin": "*",
  "methods": "GET,PUT,POST,DELETE",
  "preflightContinue": false,
  "optionsSuccessStatus": 204,
};

export default class Endpoint {
  private app: any;

  constructor() {
    this.app = express();
    this.app.use(cors(corsOptions));
    this.app.use(bodyParser.json({ strict: false }));
  }

  make(endpoint: string) {
    switch (endpoint) {
      case 'createProject':
        this.app.post('/project/', (req: express.Request, res: express.Response) => {
          new RequestHandler(req, res).createProject();
        });
        break;
      case 'getProjectCards':
        this.app.get('/projects/', (req: express.Request, res: express.Response) => {
          new RequestHandler(req, res).getProjectCards();
        });
        break;
      case 'getProjectDetails':
        this.app.get('/project/:project_id/', (req: express.Request, res: express.Response) => {
          new RequestHandler(req, res).getProjectDetails();
        });
        break;
      case 'editProject':
        this.app.put('/project/', (req: express.Request, res: express.Response) => {
          new RequestHandler(req, res).editProject();
        });
        break;
      case 'updateProjectStatus':
        this.app.put('/project/', (req: express.Request, res: express.Response) => {
          new RequestHandler(req, res).updateProjectStatus();
        });
        break;
      case 'likeProject':
        this.app.post('/user/likeProject/', (req: express.Request, res: express.Response) => {
          new RequestHandler(req, res).likeProject();
        });
        break;
      default:
        throw `${endpoint} is not a valid endpoint name`;
        return;
    }

    return serverless(this.app);
  }
}
