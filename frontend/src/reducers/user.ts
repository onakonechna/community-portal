import { TypeKeys } from '../actions';
import * as _ from 'lodash';
import {
  ADD_STARRED_PROJECT,
  REMOVE_STARRED_PROJECT,
  LOAD_STARRED_PROJECTS_END
} from '../../types/user';

const defaultUser = {
  user_id: '',
  avatar_url: '',
  name: '',
  role: 'guest',
  likedProjects: [],
  bookmarkedProjects: [],
  scopes: [],
  upvoted_projects: []
};

export default function user(state = defaultUser, action:any) {
  switch (action.type) {
    case TypeKeys.LOAD_USER:
      return Object.assign({}, state, action.user);
    case TypeKeys.UPDATE_USER_ROLE:
      return Object.assign({}, state, {
        role: action.role,
      });
    case TypeKeys.UPDATE_USER_SCOPES:
      return Object.assign({}, state, {
        scopes: action.scopes,
      });
    case TypeKeys.LOAD_LIKED_PROJECTS:
      return Object.assign({}, state, {
        likedProjects: action.projects,
      });
    case LOAD_STARRED_PROJECTS_END:
      return {
        ...state,
        upvoted_projects: action.projects
      };
    case ADD_STARRED_PROJECT:
      return {
        ...state,
        upvoted_projects: [
          ...state.upvoted_projects,
          action.project
        ]
      };
    case REMOVE_STARRED_PROJECT:
      return {
        ...state,
        upvoted_projects: _.filter(state.upvoted_projects, (project:any) => project.project_id !== action.github_id)
      };
    case TypeKeys.LOAD_BOOKMARKED_PROJECTS:
      return Object.assign({}, state, {
        bookmarkedProjects: action.projects,
      });
    default:
      return state;
  }
}
