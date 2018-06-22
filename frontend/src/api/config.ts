export const API = 'https://cef6942jo1.execute-api.us-east-1.amazonaws.com/dev';

const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbiI6IjE5ZDI4YjFmNzk5OGIzOTI3ZjMzZDVhYTVlMzhjYjM4ZjM4ZDZiN2QiLCJuYW1lIjpudWxsLCJlbWFpbCI6bnVsbCwiY29tcGFueSI6bnVsbCwiYXZhdGFyX3VybCI6Imh0dHBzOi8vYXZhdGFyczMuZ2l0aHVidXNlcmNvbnRlbnQuY29tL3UvMzk3NDExODU_dj00IiwibG9jYXRpb24iOm51bGwsImh0bWxfdXJsIjoiaHR0cHM6Ly9naXRodWIuY29tL1hpeWFNYWdlbnRvIiwidXJsIjoiaHR0cHM6Ly9hcGkuZ2l0aHViLmNvbS91c2Vycy9YaXlhTWFnZW50byIsInVzZXJfaWQiOiIzOTc0MTE4NSIsImlhdCI6MTUyOTU5NTU3OCwiZXhwIjoxNTMxMzIzNTc4fQ.ZELg0upwbchR_5oMRqNOGOMKf_gBOqx8_UgekJsrzlA';

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
