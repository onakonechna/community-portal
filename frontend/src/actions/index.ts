import fetchProject from '../api/FetchProject';
import bookmarkProject from '../api/BookmarkProject';
import fetchProjects from '../api/FetchProjects';
import getBookmarkedProjects from '../api/GetBookmarkedProjects';
import getLikedProjects from '../api/GetLikedProjects';
import { editProject, editProjectStatus } from  '../api/EditProject';
import pledgeProject from '../api/PledgeProject';
import scheduleMeeting from '../api/ScheduleMeeting';
import upvoteProject from '../api/UpvoteProject';
import saveProject from '../api/SaveProject';

import { Dispatch } from 'redux';
import { v4 as uuid } from 'uuid';

export enum TypeKeys {
 ADD_PROJECT = 'ADD_PROJECT',
 LOAD_USER = 'LOAD_USER',
 EDIT_PROJECT = 'EDIT_PROJECT',
 LOAD_PROJECT = 'LOAD_PROJECT',
 LOAD_LIKED_PROJECTS = 'LOAD_LIKED_PROJECTS',
 LOAD_BOOKMARKED_PROJECTS = 'LOAD_BOOKMARKED_PROJECTS',
 PROJECT_LOADED = 'PROJECT_LOADED',
 PROJECTS_LOADED = 'PROJECTS_LOADED',
 UPDATE_USER_ROLE = 'UPDATE_USER_ROLE',
 UPDATE_USER_SCOPES = 'UPDATE_USER_SCOPES',
 OTHER_ACTION = 'OTHER_ACTION',
}

export interface LoadUserAction {
  type: TypeKeys.LOAD_USER;
  user: any;
}

export interface LoadLikedProjects {
  type: TypeKeys.LOAD_LIKED_PROJECTS;
  projects: any;
}

export interface LoadBookmarkedProjects {
  type: TypeKeys.LOAD_BOOKMARKED_PROJECTS;
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
  type: TypeKeys.PROJECT_LOADED;
  project: any;
}

export interface ProjectsLoadedAction {
  type: TypeKeys.PROJECTS_LOADED;
  projects: any;
}

export interface UpdateUserRoleAction {
  type: TypeKeys.UPDATE_USER_ROLE;
  role: string;
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
 | LoadLikedProjects
 | LoadBookmarkedProjects
 | LoadUserAction
 | EditProjectAction
 | ProjectLoadedAction
 | ProjectsLoadedAction
 | UpdateUserRoleAction
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

export const bookmarkProjectAction = (id: string) => {
  return (dispatch: Dispatch) => {
    return bookmarkProject(id)
      .then(() => {
        dispatch(loadProjects());
        dispatch(getBookmarkedProjectsAction());
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
      });
  };
};

export const getBookmarkedProjectsAction: (any) = () => {
  return (dispatch: Dispatch) => {
    return getBookmarkedProjects()
      .then((res:any) => {
        let projects;
        if (res['bookmarked_projects']) {
          projects = res['bookmarked_projects'] || [];
          dispatch(loadBookmarkedProjectsAction(projects));
        }
      });
  };
};

export const loadLikedProjectsAction = (projects: any) => {
  return {
    projects,
    type: TypeKeys.LOAD_LIKED_PROJECTS,
  };
};

export const loadProject = (project_id: string) => {
  return (dispatch: Dispatch) => {
    return fetchProject(project_id)
      .then((project: any) => {
        dispatch(projectLoaded(project));
      })
      .catch((err: any) => {
        console.log(err);
      });
  };
};

export const loadBookmarkedProjectsAction = (projects: any) => {
  return {
    projects,
    type: TypeKeys.LOAD_BOOKMARKED_PROJECTS,
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

export const pledgeProjectAction = (body: any) => {
  return (dispatch: Dispatch) => {
    return pledgeProject(body)
      .then(() => {
        dispatch(loadProjects());
      });
  };
};

export const scheduleMeetingAction = (body: any) => {
  return (dispatch: Dispatch) => {
    return scheduleMeeting(body)
      .then(() => {
        dispatch(loadProjects());
      })
      .catch((err: any) => {
        console.log(err);
      });
  };
}

export const projectLoaded = (project: {}) => {
  return {
    project,
    type: TypeKeys.PROJECT_LOADED,
  };
}

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

export const UpdateUserScopesAction = (user_id: string, scopes: string[]) => {
  return {
    scopes,
    type: TypeKeys.UPDATE_USER_SCOPES,
  };
};
