import { ActionTypes, TypeKeys } from '../actions';

export default function project(state = [], action:ActionTypes) {
  switch (action.type) {
    case TypeKeys.PROJECTS_LOADED:
      return action.projects;
    case TypeKeys.ADD_PROJECT:
      return [
        ...state,
        action.project,
      ];
    default:
      return state;
  }
}
