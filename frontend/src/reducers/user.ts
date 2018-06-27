import { ActionTypes, TypeKeys } from '../actions';

const testUser = {
  user_id: '83dhh288d',
  avatar_url: '',
  name: 'Mark',
  role: 'guest',
};

export default function user(state = testUser, action:ActionTypes) {
  switch (action.type) {
    case TypeKeys.LOAD_USER:
      return Object.assign({}, state, action.user);
    case TypeKeys.UPDATE_USER_ROLE:
      return Object.assign({}, state, {
        role: action.role,
      });
    default:
      return state;
  }
}
