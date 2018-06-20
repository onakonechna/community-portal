import { API, postHeaders } from './config';

const saveProject = (project:any) => {
  return fetch(`${API}/project`, postHeaders(project))
      .then(res => res.json())
      .catch(err => err)
}

export default saveProject;
