import { ActionTypes, TypeKeys } from '../actions';

<<<<<<< HEAD
const defaultUser = {
  user_id: '',
=======
const testUser = {
  user_id: '37183938',
>>>>>>> c1a9b57ed9113cdd1df47fac39d2f6f57ef2ff9b
  avatar_url: '',
  name: '',
  role: 'guest',
  likedProjects: [],
  bookmarkedProjects: [],
  scopes: [],
};

export default function user(state = defaultUser, action:ActionTypes) {
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
    case TypeKeys.LOAD_BOOKMARKED_PROJECTS:
      return Object.assign({}, state, {
        bookmarkedProjects: action.projects,
      });
    default:
      return state;
  }
}
