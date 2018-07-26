import { API, postHeaders, request } from './Config';

const saveProject = (project:any) => {
  return request(`${API}/project`, postHeaders(project));
};

export default saveProject;
