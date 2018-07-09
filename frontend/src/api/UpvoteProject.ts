import { API, postHeaders } from './config';

const upvoteProject = (id: string) => {
  return fetch(`${API}/user/likeProject`, postHeaders({ project_id: id }))
      .then(res => res.json())
      .catch(err => err);
};

export default upvoteProject;
