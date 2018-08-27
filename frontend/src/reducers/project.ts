import { TypeKeys } from '../actions';
import * as _ from 'lodash';
import {
  UPDATE_PROJECT_STARS
} from '../../types/project';

export default function project(state = [], action:any) {
  switch (action.type) {
    case TypeKeys.PROJECTS_LOADED:
      return action.projects;
    case UPDATE_PROJECT_STARS:
      const project = _.find(state, _.matchesProperty('github_project_id', action.github_project_id));

      return [
        ..._.without(state, project),
        {...project, upvotes:  action.starsQuantity}
      ];
    case TypeKeys.ADD_PROJECT:
      return [
        ...state,
        action.project,
      ];
    default:
      return state;
  }
}
