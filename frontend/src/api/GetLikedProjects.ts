import { default as axios } from 'axios';
import { API, headers } from './Config';

const getLikedProjects = () => {
  return axios(`${API}/user/likedProjects`, headers())
    .then((res: any) => res.json());
};

export default getLikedProjects;
