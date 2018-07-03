import * as querystring from 'querystring';

interface ProjectControllerInterface {
  getGithubToken(data: any): (result: any) => any;
  getUserDataByToken(data: any): (result: any) => any;
}

export default class ProjectController implements ProjectControllerInterface {

  getGithubToken(data: any) {
    return (result: any) => {
      const { access_token } = querystring.parse(result.data);
      if (access_token === undefined) {
        throw 'Unable to retrieve access token. Check if the GitHub code is valid';
      }
      return { access_token };
    };
  }

  getUserDataByToken(data: any) {
    return (result: any) => {
      const {
          id,
          name,
          email,
          company,
          avatar_url,
          location,
          html_url,
          url,
      } = result.data;

      return {
        name,
        email,
        company,
        avatar_url,
        location,
        html_url,
        url,
        user_id: String(id),
      };
    };
  }

}
