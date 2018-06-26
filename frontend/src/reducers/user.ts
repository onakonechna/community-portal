import { ActionTypes, TypeKeys } from '../actions';

const testUser = {
  id: '83dhh288d',
  name: 'Mark',
  role: 'guest',
};

export default function user(state = testUser, action:ActionTypes) {
  switch (action.type) {
    case TypeKeys.LOAD_USER:
      return action.user;
    case TypeKeys.UPDATE_USER_ROLE:
      return Object.assign({}, state, {
        role: action.role,
      });
    default:
      return state;
  }
}
