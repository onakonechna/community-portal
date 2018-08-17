import { ActionTypes, TypeKeys } from '../actions';
// import { testData } from '../components/visualizations/source';

const defaultUser = {
  user_id: '',
  avatar_url: '',
  contribution: [],
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
