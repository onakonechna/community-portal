import { API, headers, request } from './Config';

const fetchUser = (id:string) => {
  return request(`${API}/users`, headers());
};

export default fetchUser;
