import { API, putHeaders } from './Config';

export const editProject = (project:any) => {
  return fetch(`${API}/project`, putHeaders(project))
    .then((res: any) => res.json());
};

export const editProjectStatus = (id: string, status: string) => {
  const body = {
    id,
    status,
  };
  return fetch(`${API}/project`, putHeaders(body))
    .then(res => res.json());
};
