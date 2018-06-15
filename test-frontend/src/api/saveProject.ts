import { API, postHeaders } from './config';

const saveProject = (project:any) => {
  console.log(project);
  return fetch(`${API}/projects`, postHeaders(project))
      .then(res => res.json())
      .catch(err => err)
}

export default saveProject;