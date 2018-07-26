import { default as axios } from 'axios';
import { API, headers } from './Config';

const fetchProjects = () => {
  return axios(`${API}/projects`, headers())
          .then((res:any) => res.json());
};

export default fetchProjects;
