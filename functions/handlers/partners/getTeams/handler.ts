import Endpoint from './../../../src/EndpointWrapper';
import {
  PartnersResource,
} from './../../../config/Components';
import {Request, Response} from "../../../config/Types";
import DatabaseConnection from "../../../src/resources/DatabaseConnection";
import UserResource from "../../../src/resources/UserResource/UserResource";

const endpoint = new Endpoint('/partners/teams', 'get');
const dbConnection = new DatabaseConnection();
const usersResource = new UserResource(dbConnection);
const partnersResource = new PartnersResource(dbConnection);

endpoint.configure((req: Request, res: Response) => {
  partnersResource.getTeams().then((data:any) => {
    res.json({
      status: 200,
      payload: data.Items,
    });
  })
});

const handler = endpoint.execute();
export { handler };

