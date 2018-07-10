import { API, postHeaders } from './Config';

const upvoteProject = (id: string) => {
  return fetch(`${API}/user/likeProject`, postHeaders({ project_id: id }))
      .then(res => res.json())
      .catch(err => err);
};

export default upvoteProject;
