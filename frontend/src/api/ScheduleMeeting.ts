import { API, postHeaders, request } from './Config';

import { ScheduleMeetingBody } from '../components/ProjectView/ScheduleMeetingDialog';

const scheduleMeeting = (body: ScheduleMeetingBody) => {
  return request(`${API}/project/meeting`, postHeaders(body));
};

export default saveProject;
