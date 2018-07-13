import { API, headers } from './Config';

const fetchProject = (project_id: string) => {
  return fetch(`${API}/project/${project_id}`, headers)
          .then((res:any) => res.json())
          .catch((err:any) => {
            console.log(err);
          });
};

export default fetchProject;
