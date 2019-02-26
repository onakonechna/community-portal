import { BACKEND_API, headers, request } from './Config';

const fetchProjects = (project_id: string) => {
  return request(`${BACKEND_API}/project/${project_id}`, headers());
};

export default fetchProjects;
