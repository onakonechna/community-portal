import { API, postHeaders } from './Config';

const saveProject = (project:any) => {
  return fetch(`${API}/project`, postHeaders(project))
      .then((res: any) => res.json());
};

export default saveProject;
