import { BACKEND_API, headers, request } from './Config';

const fetchProjects = () => {
  return request(`${BACKEND_API}/projects`, headers());
};

export default fetchProjects;
