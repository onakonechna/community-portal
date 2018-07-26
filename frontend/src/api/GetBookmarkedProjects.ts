import { API, headers, request } from './Config';

const getBookmarkedProjects = () => {
  return request(`${API}/user/bookmarkedProjects`, headers());
};

export default getBookmarkedProjects;
