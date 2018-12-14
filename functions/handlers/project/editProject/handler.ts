
//const dbConnection = new DatabaseConnection();
//const projectResource = new ProjectResource(dbConnection);
//const projectEditEndpoint = new Endpoint('/project', 'put');

//projectEditEndpoint.configure((req: Request, res: Response) => {
  /*const user = new User(req.tokenContents);

  if (!user.isScopeValid(user.get('scopes'), 'write:project')) {
    return res.status(401).json({payload: {
        error: true,
        message: 'User does not have the required scope to create project'}
    });
  }

  projectResource.edit(req.body)
    .then((result:any) => res.status(200).json({data: result.Attributes.project_id}))
    .catch((err:any) => {
      console.log(err);
      res.status(200).json({error:true, message: 'Cannot edit project'})
    });*/
//});

//export const handler = projectEditEndpoint.execute();


import { Request, Response } from "../../../config/Types";
import Endpoint from '../../../src/EndpointWrapper';
import ProjectUpdateController from '../../../src/project/controller/Update';

const projectUpdateEndpoint = new Endpoint('/project', 'put');

projectUpdateEndpoint.configure((req: Request, res: Response) => {
	const projectSaveController = new ProjectUpdateController();
	projectSaveController.execute(req, res);
});

export const handler = projectUpdateEndpoint.execute();
