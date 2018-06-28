declare const API_ENDPOINT: string;
export const API = API_ENDPOINT; 
//'https://cef6942jo1.execute-api.us-east-1.amazonaws.com/dev';

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
