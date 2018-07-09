import { API, putHeaders } from './config';

export const editProject = (project:any) => {
  return fetch(`${API}/project`, putHeaders(project))
    .then(res => res.json())
    .catch(err => err);
};

export const editProjectStatus = (id: string, status: string) => {
  const body = {
    id,
    status,
  };
  return fetch(`${API}/project`, putHeaders(body))
    .then(res => res.json())
    .catch(((err: Error) => {
      console.error(err);
    }));
};
