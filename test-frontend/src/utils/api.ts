const API = 'http://localhost:5000';
// const API = 'https://boebm330qg.execute-api.us-east-1.amazonaws.com/demo';

const headers = {
    mode: 'cors' as "cors",
    headers: {
      'Authorization' : 'OAuth2',
      Accept: 'application/json',
      'Content-Type': 'application/json'
    }
  }

const postHeaders = (body:any) => {
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

export const saveProject = (project:any) => {
  console.log(project);
  return fetch(`${API}/projects`, postHeaders(project))
      .then(res => res.json())
      .catch(err => err)
}

export const fetchProjects = () => {
    return fetch(`${API}/projects`, headers)
            .then((res:any) => res.json())
            .catch((err:any) => {
                console.log(err);
            })
}
