import { API, headers } from './config';

const getLikedProjects = () => {
  return fetch(`${API}/user/likedProjects`, headers)
    .then((res:any) => res.json())
    .catch((err: Error) => console.error(err));
};

export default getLikedProjects;
