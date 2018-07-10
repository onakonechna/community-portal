import fetchProjects from '../api/FetchProjects';
import getLikedProjects from '../api/GetLikedProjects';
import { editProject, editProjectStatus } from  '../api/EditProject';
import pledgeProject from '../api/PledgeProject';
import upvoteProject from '../api/UpvoteProject';
import saveProject from '../api/SaveProject';

import { Dispatch } from 'react-redux';
import { v4 as uuid } from 'uuid';

export enum TypeKeys {
 ADD_PROJECT = 'ADD_PROJECT',
 LOAD_USER = 'LOAD_USER',
 EDIT_PROJECT = 'EDIT_PROJECT',
 LOAD_PROJECT = 'LOAD_PROJECT',
 LOAD_LIKED_PROJECTS = 'LOAD_LIKED_PROJECTS',
 PROJECTS_LOADED = 'PROJECTS_LOADED',
 UPDATE_USER_ROLE = 'UPDATE_USER_ROLE',
 OTHER_ACTION = '__any__other__action__type',
}

export interface LoadUserAction {
  type: TypeKeys.LOAD_USER;
  user: any;
}

export interface LoadLikedProjects {
  type: TypeKeys.LOAD_LIKED_PROJECTS;
  projects: any;
}

export interface AddProjectAction {
  type: TypeKeys.ADD_PROJECT;
  project: any;
}

export interface EditProjectAction {
  type: TypeKeys.EDIT_PROJECT;
  project: any;
}

export interface ProjectLoadedAction {
  type: TypeKeys.PROJECTS_LOADED;
  projects: any;
}

export interface UpdateUserRoleAction {
  type: TypeKeys.UPDATE_USER_ROLE;
  role: string;
}

export interface OtherAction {
  type: TypeKeys.OTHER_ACTION;
}

export type ActionTypes =
 | AddProjectAction
 | LoadLikedProjects
 | LoadUserAction
 | EditProjectAction
 | ProjectLoadedAction
 | UpdateUserRoleAction
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

export const editProjectBody = (project: {}) => {
  return (dispatch: Dispatch) => {
    return editProject(project)
      .then(() => {
        dispatch(loadProjects());
      });
  };
};

export const editProjectStatusAction = (id: string, status: string) => {
  return (dispatch: Dispatch) => {
    return editProjectStatus(id, status);
  };
};

export const likeProject = (id: string) => {
  return (dispatch: Dispatch) => {
    return upvoteProject(id)
      .then(() => {
        dispatch(loadProjects());
        dispatch(getLikedProjectsAction());
      });
  };
};

export const getLikedProjectsAction: (any) = () => {
  return (dispatch: Dispatch) => {
    return getLikedProjects()
    .then((res:any) => {
      let projects;
      if (res['upvoted_projects']) {
        projects = res['upvoted_projects'] || [];
        dispatch(loadLikedProjectsAction(projects));
      }
    })
    .catch((err: Error) => console.error(err));
  };
};

export const loadLikedProjectsAction = (projects: any) => {
  return {
    projects,
    type: TypeKeys.LOAD_LIKED_PROJECTS,
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

export const pledgeProjectAction = (body: any) => {
  return (dispatch: Dispatch) => {
    return pledgeProject(body)
      .then(() => {
        dispatch(loadProjects());
      });
  };
};

export const projectsLoaded = (projects: {}) => {
  return {
    projects,
    type: TypeKeys.PROJECTS_LOADED,
  };
};

export const LoadUserAction = (user: {}) => {
  return {
    user,
    type: TypeKeys.LOAD_USER,
  };
};

export const UpdateUserRoleAction = (user_id: string, role: string) => {
  return {
    role,
    type: TypeKeys.UPDATE_USER_ROLE,
  };
};
