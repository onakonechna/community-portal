interface PartnerTeamControllerInterface {
  prepareUsersToSave(users: any[], teamName:string, githubTeamName:string, githubTeamId:string): (data: any) => any;
  getTeams(): (result: any) => any;
}

export default class PartnerTeamController implements PartnerTeamControllerInterface{
  prepareUsersToSave(users:any[], teamName:string, githubTeamName:string, githubTeamId:string) {
    let result:any = {};

    users.forEach((user:any) => {
      console.log(user);
      result[user.login] = {
        user_id: user.id.toString(),
        user_login: user.login,
        team_id: teamName,
        github_team_name: githubTeamName,
        github_team_id: githubTeamId,
        status: 'unverified'
      }
    });

    return result;
  }

  getMapByProp(arr:any[], collection:any) {
    let result:any = [];

    console.log('ARR', arr);
    console.log('collection', collection);

    arr.forEach((property:string) => {
      result.push(collection[property]);
    });

    return result;
  }

  getMembersFromUsers(members:any[], users:any) {
    let result:any = [];

    members.forEach((owner:string) => {
      result.push(users[owner]);
    });

    return result;
  }

  getTeams() {
    return (result: any) => {
      return {
        status: 200,
        payload: result.Items,
      };
    };
  }
}
