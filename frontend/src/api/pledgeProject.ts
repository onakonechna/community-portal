import { API, postHeaders } from './config';

import { PledgeBody } from '../components/PledgeDialog';

const pledgeProject = (body: PledgeBody) => {
  return fetch(`${API}/user/pledge`, postHeaders(body))
    .then(res => res.json())
    .catch(err => err);
};

export default pledgeProject;
