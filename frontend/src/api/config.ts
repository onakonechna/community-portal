// export const API = 'https://cef6942jo1.execute-api.us-east-1.amazonaws.com/dev';
export const API = 'https://iq0sxk313f.execute-api.us-east-1.amazonaws.com/dev';

const token: any = localStorage.getItem('oAuth') !== 'undefined' ? JSON.parse(localStorage.getItem('oAuth') || '{}') : '';

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
