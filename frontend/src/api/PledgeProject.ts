import { API, postHeaders } from './Config';

import { PledgeBody } from '../components/PledgeDialog';

const pledgeProject = (body: PledgeBody) => {
  return fetch(`${API}/user/pledge`, postHeaders(body))
    .then((res: any) => res.json());
};

export default pledgeProject;
