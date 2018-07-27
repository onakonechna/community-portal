import { API, headers, request } from './Config';

const fetchProjects = (project_id: string) => {
  return request(`${API}/project/${project_id}`, headers());
};

export default fetchProjects;
