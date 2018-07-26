import { API, putHeaders, request } from './Config';

export const editProject = (project:any) => {
  return request(`${API}/project`, putHeaders(project));
};

export const editProjectStatus = (id: string, status: string) => {
  const body = {
    id,
    status,
  };
  return request(`${API}/project/status`, putHeaders(body));
};
