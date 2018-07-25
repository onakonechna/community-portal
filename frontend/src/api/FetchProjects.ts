import { API, headers } from './Config';

const fetchProjects = () => {
  return fetch(`${API}/projects`, headers())
          .then((res:any) => res.json());
};

export default fetchProjects;
