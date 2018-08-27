import {
  ADD_STARRED_PROJECT,
  REMOVE_STARRED_PROJECT,
  LOAD_STARRED_PROJECTS_START,
  LOAD_STARRED_PROJECTS_END
} from '../../types/user';
import { Dispatch } from 'redux';
import getStarredProjects from '../api/GetLikedProjects';

export const addStarredProject = (project:any) => (dispatch:Dispatch) => dispatch({
  type: ADD_STARRED_PROJECT,
  project
});

export const removeStarredProject = (github_id:string) => (dispatch:Dispatch) => dispatch({
  type: REMOVE_STARRED_PROJECT,
  github_id
});

export const loadStarredProjects =  () => (dispatch:Dispatch) => {
  dispatch({
    type: LOAD_STARRED_PROJECTS_START
  });

  return getStarredProjects()
    .then((result:any) => dispatch({
      type: LOAD_STARRED_PROJECTS_END,
      projects: result.data
    }))
};