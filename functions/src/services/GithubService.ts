import axios from 'axios';

const token = process.env.GITHUB_USER_TOKEN;

class GithubService {
  createTeam(name:string, parent_team_id?:string) {
    const options = {
      method: 'POST',
      url: 'https://api.github.com/orgs/magento/teams',
      data: {
        "name": name,
        "parent_team_id": parent_team_id || 2545914
      },
      headers: {
        'User-Agent': 'community-portal-app',
        'Authorization': `token ${token}`,
        'Accept': 'application/vnd.github.hellcat-preview+json'
      }
    };

    return axios(options);
  }

  getTeams(parent_team_id?:string) {
    const options = {
      method: 'GET',
      url: `https://api.github.com/teams/${parent_team_id || 2545914}/teams`,
      headers: {
        'User-Agent': 'community-portal-app',
        'Authorization': `token ${token}`,
        'Accept': 'application/vnd.github.hellcat-preview+json'
      }
    };

    return axios(options);
  }

  getTeamsInOrganizationByName(name:string) {
    const options = {
      method: 'GET',
      url: `https://api.github.com/orgs/${name}/teams`,
      headers: {
        'User-Agent': 'community-portal-app',
        'Authorization': `token ${token}`
      }
    };

    return axios(options);
  }

  getUserByLogin(login:string) {
    const options = {
      method: 'GET',
      url: `https://api.github.com/users/${login}`,
      headers: {
        'User-Agent': 'community-portal-app'
      }
    };

    return axios(options);
  }

  upvoteRepository(org:string, repos:string, userToken:string) {
    const options = {
      method: 'PUT',
      url: `https://api.github.com/user/starred/${org}/${repos}`,
      headers: {
        'User-Agent': 'community-portal-app',
        'Authorization': `token ${userToken}`
      }
    };

    return axios(options);
  }

  downvoteRepository(org:string, repos:string, userToken:string) {
    const options = {
      method: 'DELETE',
      url: `https://api.github.com/user/starred/${org}/${repos}`,
      headers: {
        'User-Agent': 'community-portal-app',
        'Authorization': `token ${userToken}`
      }
    };

    return axios(options);
  }

  getStarredUsers(org:string, repos:string, page:number) {
    const url = `https://api.github.com/repos/${org}/${repos}/stargazers`;
    const options = {
      method: 'GET',
      url: page ? url + `?page=${page}` : url,
      headers: {
        'User-Agent': 'community-portal-app',
      }
    };

    return axios(options);
  }

  getUsersByLogin(logins:string[]) {
    let promises:any[] = [];

    logins.forEach((login:string) => {
      promises.push(this.getUserByLogin(login));
    });

    return Promise.all(promises).then((result:any) => {
      return result.map((item:any) => item.data)
    })
  }

  getUserStarred(userToken:string) {
    const options = {
      method: 'GET',
      url: `https://api.github.com/user/starred`,
      headers: {
        'User-Agent': 'community-portal-app',
        'Authorization': `token ${userToken}`
      }
    };

    return axios(options);
  }

  getTeamMembers(id: number) {
    const options = {
      method: 'GET',
      url: `https://api.github.com/teams/${id}/members`,
      headers: {
        'User-Agent': 'community-portal-app',
        'Authorization': `token ${token}`
      }
    };

    return axios(options);
  }

  getRepository(org:string, repos: string) {
    const options = {
      method: 'GET',
      url: `https://api.github.com/repos/${org}/${repos}`,
      headers: {
        'User-Agent': 'community-portal-app',
        'Authorization': `token ${token}`
      }
    };

    return axios(options);
  }

  inviteUserToTeam(userLogin:string, teamId:string) {
    const options = {
      method: 'PUT',
      url: `https://api.github.com/teams/${teamId}/memberships/${userLogin}`,
      headers: {
        'User-Agent': 'community-portal-app',
        'Authorization': `token ${token}`
      }
    };

    return axios(options);
  }

  inviteUsersToTeam(users:any[], teamId:string) {
    let promises:any[] = [];

    users.forEach((user:any) => promises.push(this.inviteUserToTeam(user.login, teamId)));

    return Promise.all(promises).then((invitations:any) => {
      let result:any = {
        error: false,
        list: []
      };

      invitations.forEach((invitation:any, index:number) => {
        if (invitation.data.state !== 'active' && invitation.data.state !== 'pending') {
          result.error = true;
          result.list.push(users[index])
        }
      });

      return result;
    })

  }
}

export default GithubService;