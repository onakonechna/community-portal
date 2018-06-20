import { ActionTypes, TypeKeys } from '../actions';

export default function user(state = [], action:ActionTypes) {
  switch (action.type) {
    case TypeKeys.ADD_USER:
      return action.users;
    default:
      return state;
  }

}
