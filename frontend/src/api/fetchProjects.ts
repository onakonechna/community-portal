import { API, headers } from './config';

const fetchProjects = () => {
  return fetch(`${API}/projects`, headers)
          .then((res:any) => res.json())
          .catch((err:any) => {
              console.log(err);
          })
}

export default fetchProjects;
