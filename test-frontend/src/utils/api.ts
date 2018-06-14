const API = 'http://localhost:5000';

const headers = {
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
            .then(res => res.json())
            .catch(err => {
                console.log(err);
            })
}   
