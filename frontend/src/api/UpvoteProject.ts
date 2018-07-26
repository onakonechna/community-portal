import { API, postHeaders, request } from './Config';

const upvoteProject = (id: string) => {
  return request(`${API}/user/likeProject`, postHeaders({ project_id: id }));
};

export default upvoteProject;
