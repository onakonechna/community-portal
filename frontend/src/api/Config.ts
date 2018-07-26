declare const API_ENDPOINT: string;
export const API = API_ENDPOINT;

function getToken() {
  const localToken = localStorage.getItem('oAuth');
  const token: any = localToken !== null ? JSON.parse(localToken) : '';
  return token;
}

export const headers = () => ({
  headers: {
    Authorization : getToken(),
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

export const postHeaders = (data:any) => {
  return {
    data,
    method: 'post',
    headers: {
      Authorization: getToken(),
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  };
};

export const putHeaders = (data:any) => {
  return {
    data,
    method: 'put',
    headers: {
      Authorization: getToken(),
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  };
};
