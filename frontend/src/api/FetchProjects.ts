import { API, headers, request } from './Config';

const fetchProjects = () => {
  return request(`${API}/projects`, headers());
};

export default fetchProjects;
