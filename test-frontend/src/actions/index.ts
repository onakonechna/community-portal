import { 
    fetchProjects,
    saveProject 
} from '../utils/api';

import { Dispatch } from 'react-redux';
import { v4 as uuid } from 'uuid';

export const ADD_PROJECT = 'ADD_PROJECT';
export const ADD_USER = 'ADD_USER'
export const LOAD_PROJECT = 'LOAD_PROJECT';
export const PROJECTS_LOADED = 'PROJECTS_LOADED';

export const addProject = (project: {}) => {
    const projectBody = {
        ...project,
        id: uuid(),
        created: Date.now()
      };
    return (dispatch:any) => {
        return saveProject(projectBody)
          .then(() => {
              dispatch(loadProjects());
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