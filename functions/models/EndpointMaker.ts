import * as express from "express";
import RequestHandler from './RequestHandler';

const serverless = require('serverless-http');
const cors = require('cors');
const bodyParser = require('body-parser');

export default class EndpointMaker {
  private app: any;

  constructor() {
    this.app = express();
    this.app.use(cors());
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
      case 'updateProjectStatus':
        this.app.post('/project/status/', (req: express.Request, res: express.Response) => {
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
