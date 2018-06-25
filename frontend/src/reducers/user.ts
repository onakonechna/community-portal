import { ActionTypes, TypeKeys } from '../actions';

const testUser = {
  name: 'Mark',
  role: 'owner',
};

export default function user(state = testUser, action:ActionTypes) {
  switch (action.type) {
    case TypeKeys.ADD_USER:
      return action.users;
    default:
      return state;
  }
}
