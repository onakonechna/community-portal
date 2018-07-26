import { default as axios } from 'axios';
import { API, postHeaders } from './Config';

const bookmarkProject = (id: string) => {
  return axios(`${API}/user/bookmarkProject`, postHeaders({ project_id: id }))
      .then((res: any) => res.json());
};

export default bookmarkProject;
