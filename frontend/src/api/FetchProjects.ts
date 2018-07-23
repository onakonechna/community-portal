import { API, headers } from './Config';

const fetchProjects = () => {
  return fetch(`${API}/projects`, headers())
          .then((res:any) => res.json())
          .catch((err:any) => {
            console.log(err);
          });
};

export default fetchProjects;
