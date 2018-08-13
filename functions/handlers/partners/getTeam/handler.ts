import Endpoint from './../../../src/Endpoint';
import {PartnersResource} from './../../../config/Components';
import {Request, Response} from "../../../config/Types";
import DatabaseConnection from "../../../src/resources/DatabaseConnection";
import UserResource from "../../../src/resources/UserResource/UserResource";

const endpoint = new Endpoint('/partners/team/:id', 'get');
const dbConnection = new DatabaseConnection();
const usersResource = new UserResource(dbConnection);
const partnersResource = new PartnersResource(dbConnection);

const getIds = (collection:any) => collection.map((item:any) => item.id);
const prepareResponse = (promise:any, type:string) => promise.then((data:any) => ({...data, type}));

endpoint.configure((req: Request, res: Response) => {
  const team_id = req.params.id;

  partnersResource.getTeam(team_id).then((data:any) => {
    let team = data.Item;
    let ownersId = getIds(team.owners);
    let membersId = getIds(team.members);
    let promises:any = [];

    if (ownersId.length) {promises.push(prepareResponse(usersResource.getUsersById(ownersId), 'owners'))}
    if (membersId.length) {promises.push(prepareResponse(usersResource.getUsersById(membersId), 'members'))}

    Promise.all(promises).then((result:any) => {
      result.forEach((item:any) => {
        if (item.type === 'owners') {
          team.owners = item.data;
        } else if (item.type === 'members') {
          team.members = item.data;
        }
      });

      return res.json({
        status: 200,
        payload: {
          team
        }
      });
    });
  });
});

const handler = endpoint.execute();
export { handler };
