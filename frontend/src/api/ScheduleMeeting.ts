import { API, postHeaders } from './Config';

import { ScheduleMeetingBody } from '../components/ProjectView/ScheduleMeetingDialog';

const scheduleMeeting = (body: ScheduleMeetingBody) => {
  return fetch(`${API}/project/meeting`, postHeaders(body))
    .then((res: any) => res.json())
    .catch((err: Error) => console.error(err));
};

export default scheduleMeeting;
