import { API, headers } from './Config';

const getLikedProjects = () => {
  return fetch(`${API}/user/likedProjects`, headers())
    .then((res: any) => res.json());
};

export default getLikedProjects;
