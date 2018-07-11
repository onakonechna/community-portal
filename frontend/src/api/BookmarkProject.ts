import { API, postHeaders } from './Config';

const bookmarkProject = (id: string) => {
  return fetch(`${API}/user/bookmarkProject`, postHeaders({ project_id: id }))
      .then(res => res.json())
      .catch(err => err);
};

export default bookmarkProject;
