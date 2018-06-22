import { API, putHeaders } from './config';

import { PledgeBody } from '../components/PledgeDialog';

const pledgeProject = (body: PledgeBody) => {
  return fetch(`${API}/project/pledge`, putHeaders(body))
    .then(res => res.json())
    .catch(err => err);
};

export default pledgeProject;
