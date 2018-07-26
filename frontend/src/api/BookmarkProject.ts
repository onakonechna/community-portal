import { API, postHeaders, request } from './Config';

const bookmarkProject = (id: string) => {
  return request(`${API}/user/bookmarkProject`, postHeaders({ project_id: id }));
};

export default bookmarkProject;
