import { default as axios } from 'axios';
import { API, postHeaders } from './Config';

const upvoteProject = (id: string) => {
  return axios(`${API}/user/likeProject`, postHeaders({ project_id: id }))
      .then((res: any) => res.json());
};

export default upvoteProject;
