import { ActionTypes, TypeKeys } from '../actions';

export default function oneproject(state = {}, action:ActionTypes) {
  switch (action.type) {
    case TypeKeys.PROJECT_LOADED:
      return action.project;
    default:
      return state;
  }
}
