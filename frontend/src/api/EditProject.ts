import { default as axios } from 'axios';
import { API, putHeaders } from './Config';

export const editProject = (project:any) => {
  return axios(`${API}/project`, putHeaders(project))
    .then((res: any) => res.json());
};

export const editProjectStatus = (id: string, status: string) => {
  const body = {
    id,
    status,
  };
  return axios(`${API}/project`, putHeaders(body))
    .then((res: any) => res.json());
};
