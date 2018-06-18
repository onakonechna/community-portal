// export const API = 'http://localhost:5000';
export const API = 'https://boebm330qg.execute-api.us-east-1.amazonaws.com/demo';

export const headers = {
    mode: 'cors' as "cors",
    headers: {
      'Authorization' : 'OAuth2',
      Accept: 'application/json',
      'Content-Type': 'application/json'
    }
  }

export const postHeaders = (body:any) => {
  return {
    method: 'POST',
    body: JSON.stringify(body),
    headers: {
      method: 'POST',
      'Authorization' : 'OAuth2',
      Accept: 'application/json',
      'Content-Type': 'application/json'
    }
  }
}


