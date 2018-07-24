import * as express from 'express';

interface CustomizedRequest {
  tokenContents: any;
}

/** Override aws-lambda type definition to support string errors
 * string error supported in latest Github version but not in npm version as of 06-06-2018
 */
type Callback<TResult = any> = (error?: Error | null | string, result?: TResult) => void;
type Request = express.Request & CustomizedRequest;
type Response = express.Response;

export {
  Callback,
  Request,
  Response,
};
