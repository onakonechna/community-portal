import { API, postHeaders } from './Config';

const saveProject = (project:any) => {
  return fetch(`${API}/project`, postHeaders(project))
      .then(res => res.json())
      .catch(err => err);
};

export default saveProject;
