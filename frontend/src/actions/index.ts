import fetchProjects from '../api/fetchProjects';
import upvoteProject from '../api/upvoteProject';
import saveProject from '../api/saveProject';

import { Dispatch } from 'react-redux';
import { v4 as uuid } from 'uuid';

export enum TypeKeys {
 ADD_PROJECT = 'ADD_PROJECT',
 ADD_USER = 'ADD_USER',
 LOAD_PROJECT = 'LOAD_PROJECT',
 PROJECTS_LOADED = 'PROJECTS_LOADED',
 OTHER_ACTION = '__any__other__action__type',
}

export interface AddUserAction {
  type: TypeKeys.ADD_USER;
  users: any;
}

export interface AddProjectAction {
  type: TypeKeys.ADD_PROJECT;
  project: any;
}

export interface ProjectLoadedAction {
  type: TypeKeys.PROJECTS_LOADED;
  projects: any;
}

export interface OtherAction {
  type: TypeKeys.OTHER_ACTION;
}

export type ActionTypes =
 | AddProjectAction
 | AddUserAction
 | ProjectLoadedAction
 | OtherAction;

export const addProject = (project: {}) => {
  const projectBody = {
    ...project,
    project_id: uuid(),
  };
  return (dispatch: Dispatch) => {
    return saveProject(projectBody)
      .then(() => {
        dispatch(loadProjects());
      });
  };
};

export const likeProject = (id: string) => {
  return (dispatch: Dispatch) => {
    return upvoteProject(id)
      .then(() => {
        dispatch(loadProjects());
      });
  };
};

export const loadProjects: (any) = () => {
  return (dispatch: Dispatch) => {
    return fetchProjects()
      .then((projects) => {
        dispatch(projectsLoaded(projects));
      })
      .catch((err: any) => {
        console.log(err);
      });
  };
};

export const projectsLoaded = (projects: {}) => {
  return {
    projects,
    type: TypeKeys.PROJECTS_LOADED,
  };
};
