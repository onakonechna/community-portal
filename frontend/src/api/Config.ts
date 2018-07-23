declare const API_ENDPOINT: string;
export const API = API_ENDPOINT;

function getToken() {
  const localToken = localStorage.getItem('oAuth');
  const token: any = localToken !== null ? JSON.parse(localToken) : '';
  return token;
}

export const headers = () => ({
  mode: <RequestMode>'cors',
  headers: {
    Authorization : getToken(),
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

export const postHeaders = (body:any) => {
  return {
    method: 'POST',
    body: JSON.stringify(body),
    headers: {
      Authorization: getToken(),
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
      Authorization: getToken(),
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  };
};
