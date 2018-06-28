// export const API = 'https://cef6942jo1.execute-api.us-east-1.amazonaws.com/dev';
export const API = 'https://or9hwns2yk.execute-api.us-east-1.amazonaws.com/demo';

const token: any = JSON.parse(localStorage.getItem('oAuth') || '{}');

export const headers = {
  mode: <RequestMode>'cors',
  headers: {
    Authorization : 'OAuth2',
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
