import { API, headers } from './Config';

const getBookmarkedProjects = () => {
  return fetch(`${API}/user/bookmarkedProjects`, headers())
    .then((res:any) => res.json());
};

export default getBookmarkedProjects;
