import { API, postHeaders, request } from './Config';

const upvoteProject = (id: number) => {
  console.log(id);
  return request(`${API}/user/likeProject`, postHeaders({ id }));
};

export default upvoteProject;
