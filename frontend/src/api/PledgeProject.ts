import { API, postHeaders, request } from './Config';

import { PledgeBody } from '../components/PledgeDialog';

const pledgeProject = (body: PledgeBody) => {
  return request(`${API}/user/pledge`, postHeaders(body));
};

export default pledgeProject;
