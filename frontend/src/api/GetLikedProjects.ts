import { API, headers, request } from './Config';

const getLikedProjects = () => {
  return request(`${API}/user/likedProjects`, headers());
};

export default getLikedProjects;
