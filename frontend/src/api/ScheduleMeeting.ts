import { API, postHeaders, request } from './Config';

import { ScheduleMeetingBody } from './../components/ScheduleMeetingDialog';

const scheduleMeeting = (body: ScheduleMeetingBody) => {
  return request(`${API}/project/meeting`, postHeaders(body));
};

export default scheduleMeeting;
