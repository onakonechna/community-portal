interface ProjectControllerInterface {
  getGithubToken(data: any): (result: any) => any;
  getUserDataByToken(data: any): (result: any) => any;
}

export default class ProjectController implements ProjectControllerInterface {

  getGithubToken(data: any) {
    return (result: any) => {
      const { access_token } = result;
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
      } = result;

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
