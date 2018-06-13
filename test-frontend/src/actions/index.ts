import { 
    fetchProjects,
    saveProject 
} from '../utils/api';

import { Dispatch } from 'react-redux';

export const ADD_PROJECT = 'ADD_PROJECT';
export const ADD_USER = 'ADD_USER'
export const LOAD_PROJECT = 'LOAD_PROJECT';
export const PROJECTS_LOADED = 'PROJECTS_LOADED';

export const addProject = (project: {}) => {
    return (dispatch:any) => {
        saveProject(project)
          .then(() => {
              dispatch(loadProjects());
              return;
          })
    }
}

export const loadProjects = () => {
    return (dispatch:Dispatch) => {
      fetchProjects()
        .then(projects => {
        dispatch(projectsLoaded(projects))
        return;
      })
        .catch((err:any) => {
          console.log(err);
        })
    }
  }

export const projectsLoaded = (projects: {}) => {
    return {
        type: PROJECTS_LOADED,
        projects
    }
}