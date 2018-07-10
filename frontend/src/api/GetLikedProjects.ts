import { API, headers } from './Config';

const getLikedProjects = () => {
  return fetch(`${API}/user/likedProjects`, headers)
    .then((res:any) => res.json())
    .catch((err: Error) => console.error(err));
};

export default getLikedProjects;
