import { API, postHeaders } from './config';

const saveProject = (project:any) => {
  console.log(project);
  return fetch(`${API}/project/create`, postHeaders(project))
      .then(res => res.json())
      .catch(err => err)
}

export default saveProject;