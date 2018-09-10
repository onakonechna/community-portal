import { TypeKeys } from '../actions';
import * as _ from 'lodash';
import {
  UPDATE_PROJECT_STARS,
  LOAD_PROJECT_END,
  JOIN_TO_PROJECT_CONTRIBUTORS_END,
  UNJOIN_TO_PROJECT_CONTRIBUTORS_END
} from '../../types/project';

const withoutProject = (state:any[], action:any) =>
  _.filter(state, (project:any) => project.project_id !== action.project.project_id);

export default function project(state = [], action:any) {
  switch (action.type) {
    case TypeKeys.PROJECTS_LOADED:
      return action.projects;
    case LOAD_PROJECT_END:
      return [
        ...withoutProject(state, action),
        action.project
      ];
    case JOIN_TO_PROJECT_CONTRIBUTORS_END:
      return [
        ...withoutProject(state, action),
        {...action.project, contributors: {
          ...action.project.contributors,
            [action.user.user_id]: {avatar_url: action.user.avatar_url}}
        }
      ];

    case UNJOIN_TO_PROJECT_CONTRIBUTORS_END:
      return [
        ...withoutProject(state, action),
        {...action.project, contributors: [
          ..._.filter(action.project.contributors, _.matchesProperty('user_id', action.user.user_id))]
        }
      ];

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
