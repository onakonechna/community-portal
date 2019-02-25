import { editProject } from  '../api/EditProject';
import upvoteProject from '../api/UpvoteProject';
import saveProject from '../api/SaveProject';
import {loadProject} from './project';
import fetchProjects from '../api/FetchProjects';

import { Dispatch } from 'redux';
import { v4 as uuid } from 'uuid';

export enum TypeKeys {
 ADD_PROJECT = 'ADD_PROJECT',
 LOAD_USER = 'LOAD_USER',
 EDIT_PROJECT = 'EDIT_PROJECT',
 LOAD_LIKED_PROJECTS = 'LOAD_LIKED_PROJECTS',
 LOAD_BOOKMARKED_PROJECTS = 'LOAD_BOOKMARKED_PROJECTS',
 PROJECTS_LOADED = 'PROJECTS_LOADED',
 UPDATE_USER_ROLE = 'UPDATE_USER_ROLE',
 UPDATE_USER_SCOPES = 'UPDATE_USER_SCOPES',
 OTHER_ACTION = 'OTHER_ACTION',
}

export interface LoadUserAction {
  type: TypeKeys.LOAD_USER;
  user: any;
}

export interface AddProjectAction {
  type: TypeKeys.ADD_PROJECT;
  project: any;
}

export interface EditProjectAction {
  type: TypeKeys.EDIT_PROJECT;
  project: any;
}

export interface ProjectsLoadedAction {
  type: TypeKeys.PROJECTS_LOADED;
  projects: any;
}
export interface UpdateUserScopeAction {
  type: TypeKeys.UPDATE_USER_SCOPES;
  scopes: string[];
}

export interface OtherAction {
  type: TypeKeys.OTHER_ACTION;
}

export type ActionTypes =
 | AddProjectAction
 | LoadUserAction
 | EditProjectAction
 | ProjectsLoadedAction
 | UpdateUserScopeAction
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

export const loadProjects: (any) = () => {
  return (dispatch: Dispatch) => {
    return fetchProjects()
      .then((projects: any) => {
        dispatch(projectsLoaded(projects));
      });
  };
};

export const projectsLoaded = (projects: {}) => {
  return {
    projects,
    type: TypeKeys.PROJECTS_LOADED,
  };
};


export const editProjectBody = (project: any) => {
  return (dispatch: Dispatch) => {
    return editProject(project)
      .then(() => {
        dispatch(loadProjects());
        loadProject(project.id)
      });
  };
};


export const likeProject = (id: number) => {
  return (dispatch: Dispatch) => {
    return upvoteProject(id)
  };
};

export const LoadUserAction = (user: {}) => {
  return {
    user,
    type: TypeKeys.LOAD_USER,
  };
};

export const UpdateUserScopesAction = (user_id: string, scopes: string[]) => {
  return {
    scopes,
    type: TypeKeys.UPDATE_USER_SCOPES,
  };
};
