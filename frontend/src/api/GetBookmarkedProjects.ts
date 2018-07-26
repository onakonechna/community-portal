import { default as axios } from 'axios';
import { API, headers } from './Config';

const getBookmarkedProjects = () => {
  return axios(`${API}/user/bookmarkedProjects`, headers())
    .then((res:any) => res.json());
};

export default getBookmarkedProjects;
