import * as express from 'express';

interface CustomizedRequest {
  tokenContents: any;
}

type Request = express.Request & CustomizedRequest;
type Response = express.Response;

export {
  Request,
  Response,
}
