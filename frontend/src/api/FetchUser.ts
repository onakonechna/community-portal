import { API, headers, request } from './Config';

const fetchUser = (id:string) => {
  return request(`${API}/user/${id}`, headers());
};

export default fetchUser;
