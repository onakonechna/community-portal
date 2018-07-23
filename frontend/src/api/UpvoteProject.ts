import { API, postHeaders } from './Config';

const upvoteProject = (id: string) => {
  return fetch(`${API}/user/likeProject`, postHeaders({ project_id: id }))
      .then((res: any) => res.json())
      .catch((err: Error) => console.error(err));
};

export default upvoteProject;
