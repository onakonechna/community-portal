import { API, headers } from './Config';

const getBookmarkedProjects = () => {
  return fetch(`${API}/user/bookmarkedProjects`, headers)
    .then((res:any) => res.json())
    .catch((err: Error) => console.error(err));
};

export default getBookmarkedProjects;
