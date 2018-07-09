declare const API_ENDPOINT: string;
// export const API = API_ENDPOINT;
export const API = 'http://localhost:3000';

const localToken = localStorage.getItem('oAuth');
const token: any = localToken !== null ? JSON.parse(localToken) : '';

export const headers = {
  mode: <RequestMode>'cors',
  headers: {
    Authorization : token,
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
};

export const postHeaders = (body:any) => {
  return {
    method: 'POST',
    body: JSON.stringify(body),
    headers: {
      Authorization: token,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  };
};

export const putHeaders = (body:any) => {
  return {
    method: 'PUT',
    body: JSON.stringify(body),
    headers: {
      Authorization: token,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  };
};
