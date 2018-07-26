import { default as axios } from 'axios';
import { API, postHeaders } from './Config';

const saveProject = (project:any) => {
  return axios(`${API}/project`, postHeaders(project))
      .then((res: any) => res.json());
};

export default saveProject;
