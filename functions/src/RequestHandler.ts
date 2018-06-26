import * as express from 'express';
import Validator from './Validator';
import ProjectResource from './resources/ProjectResource/ProjectResource';


interface IMessage {
  message: string;
  project_id: string;
}

// helper function
function createDynamodbResponse(
  dynamodbRequest: Promise<Object>,
  res: express.Response,
  getResponse: (result?: any) => [number, IMessage | Object],
  error: string,
) {
  dynamodbRequest
    .then((result: any) => {
      const [statusCode, payload] = getResponse(result);
      res.status(statusCode).json(payload);
    })
    .catch((error: Error) => {
      console.log(error);
      res.status(400).json({ error });
    });
}

export default class RequestHandler {
  private req: express.Request;
  private res: express.Response;

  constructor(req: express.Request, res: express.Response) {
    this.req = req;
    this.res = res;
  }

  // to be used internally
  validate(data: Object, schemaName: string) {
    const validator = new Validator(schemaName);
    const valid = validator.validate(data);
    if (!valid) {
      this.res.status(400).json({ errors: validator.errors });
      return false;
    }
    return true;
  }

  createProject() {
    if (!this.validate(this.req.body, 'createProjectSchema')) return;
    const request = new ProjectResource().create(this.req.body);
    const getResponse = (): [number, IMessage] => {
      return [200, {
        message: 'Project created successfully',
        project_id: this.req.body.project_id,
      }];
    };
    const error = 'Could not create project';
    createDynamodbResponse(request, this.res, getResponse, error);
  }

  getProjectCards() {
    const request = new ProjectResource().get(this.req.body);
    const getResponse = (result: any): [number, Object] => {
      if (result.Items) {
        return [200, result.Items];
      }
      return [404, { error: 'No project found' }];
    };
    const error = 'Could not get project cards';
    createDynamodbResponse(request, this.res, getResponse, error);
  }

  getProjectDetails() {
    if (!this.validate(this.req.params, 'projectIdOnlySchema')) return;
    const request = new ProjectResource().getById(this.req.params);
    const getResponse = (result: any): [number, Object] => {
      if (result.Item) {
        return [200, result.Item];
      }
      return [404, { error: 'project not found' }];
    };
    const error = 'Could not get project';
    createDynamodbResponse(request, this.res, getResponse, error);
  }

  editProject() {
    if (!this.validate(this.req.body, 'editProjectSchema')) return;
    const request = new ProjectResource().update(this.req.body);
    const getResponse = (): [number, IMessage] => [200, {
      message: 'Project edited successfully',
      project_id: this.req.body.project_id,
    }];
    const error = 'Could not edit project';
    createDynamodbResponse(request, this.res, getResponse, error);
  }

  updateProjectStatus() {
    if (!this.validate(this.req.body, 'updateProjectStatusSchema')) return;
    const request = new ProjectResource().updateStatus(this.req.body);
    const getResponse = (): [number, IMessage] => [200, {
      message: 'Project status updated successfully',
      project_id: this.req.body.project_id,
    }];
    const error = 'Could not update project status';
    createDynamodbResponse(request, this.res, getResponse, error);
  }

  likeProject() {
    if (!this.validate(this.req.body, 'projectIdOnlySchema')) return;
    const request = new ProjectResource().upvote(this.req.body);
    const getResponse = (): [number, IMessage] => [200, {
      message: 'Project upvoted successfully',
      project_id: this.req.body.project_id,
    }];
    const error = 'Could not upvote project';
    createDynamodbResponse(request, this.res, getResponse, error);
  }
}
