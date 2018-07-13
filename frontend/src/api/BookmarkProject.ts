import { API, postHeaders } from './Config';

const bookmarkProject = (id: string) => {
  return fetch(`${API}/user/bookmarkProject`, postHeaders({ project_id: id }))
      .then((res: any) => res.json())
      .catch((err: Error) => console.error(err));
};

export default bookmarkProject;
