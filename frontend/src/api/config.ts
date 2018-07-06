// export const API = 'https://iq0sxk313f.execute-api.us-east-1.amazonaws.com/dev';
export const API = 'http://localhost:3000';

// const localToken = localStorage.getItem('oAuth');
// const token: any = localToken !== null ? JSON.parse(localToken) : '';

const token: any = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.\
eyJ1c2VyX2lkIjoiMTI3NjAzNzMiLCJpYXQiOjE1MzAyMjIzOTgsImV4c\
CI6MTUzMDMwODc5OH0.z9iMdV0TiMRps6xRpwEnISOJjKcPkEEcuxGc3yveZ5Y';

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
