import axios from 'axios';

interface TokenAPIInterface {
  getGithubToken(data: any): Promise<any>;
  getUserDataByToken(data: any): Promise<any>
};

export default class TokenAPI implements TokenAPIInterface {
  getGithubToken(data: any) {
    const { code } = data;
    const options = {
      method: 'POST',
      url: 'https://github.com/login/oauth/access_token',
      headers: { 'content-length': 256 },
      data: {
        code,
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
      },
    };

    return axios(options);
  }

  getUserDataByToken(data: any) {
    const { access_token } = data;
    const options = {
      method: 'GET',
      url: 'https://api.github.com/user',
      params: { access_token },
      headers: { 'User-Agent': 'community-portal-app' },
    };

    return axios(options);
  }
}
