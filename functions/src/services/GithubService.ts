import axios from 'axios';

const token = process.env.GITHUB_USER_TOKEN;

class GithubService {
  getTeamsByOrganizationName(name:string) {
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

  getRepository(org:string, repos: string) {
    const options = {
      method: 'GET',
      url: `https://api.github.com/repos/${org}/${repos}`,
      headers: {
        'User-Agent': 'community-portal-app'
      }
    };

    return axios(options);
  }

  getTeamMembers(id:number) {
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
}

export default GithubService;