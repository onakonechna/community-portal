import { ActionTypes, TypeKeys } from '../actions';

const testUser = {
  user_id: '37183938',
  avatar_url: '',
  name: '',
  role: 'guest',
  likedProjects: [],
  bookmarkedProjects: [],
};

export default function user(state = testUser, action:ActionTypes) {
  switch (action.type) {
    case TypeKeys.LOAD_USER:
      return Object.assign({}, state, action.user);
    case TypeKeys.UPDATE_USER_ROLE:
      return Object.assign({}, state, {
        role: action.role,
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
