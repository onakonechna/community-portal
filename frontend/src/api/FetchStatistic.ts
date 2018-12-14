import { API, headers, request } from './Config';

const fetchStatistic = (id:string) => {
  return request(`${API}/user/statistic/${id}`, headers());
};

export default fetchStatistic;
