import { TypeKeys } from '../actions';
import _filter from 'lodash/filter';
import _find from 'lodash/find';
import _without from 'lodash/without';
import _matchesProperty from 'lodash/matchesProperty';

import {
  LOAD_PROJECT_END,
  JOIN_TO_PROJECT_CONTRIBUTORS_END,
  UNJOIN_TO_PROJECT_CONTRIBUTORS_END,
  BOOKMARK_PROJECT_END,
  UNBOOKMARK_PROJECT_END
} from '../../types/project';

import {
	UPDATE_PROJECT_STARS
} from '../../types/projectStars';

const withoutProject = (state:any[], action:any) => {
  return _filter(state, (project:any) => project.id !== action.project.id);
};

export default function project(state = [], action:any) {
  switch (action.type) {
    case TypeKeys.PROJECTS_LOADED:
      return action.projects;
    case LOAD_PROJECT_END:
      return [
        ...withoutProject(state, action),
        action.project
      ];
    case BOOKMARK_PROJECT_END:
      return [
        ...withoutProject(state, action),
				{...action.project, bookmarked: [...action.project.bookmarked, action.user]}
      ];
    case UNBOOKMARK_PROJECT_END:
      return [
        ...withoutProject(state, action),
        {
          ...action.project,
          bookmarked: action.project.bookmarked.filter((project:any) => project.id !== action.user.id)}
      ];

    case JOIN_TO_PROJECT_CONTRIBUTORS_END:
      return [
        ...withoutProject(state, action),
				{...action.project, contributors: [...action.project.contributors, action.user]}
      ];

    case UNJOIN_TO_PROJECT_CONTRIBUTORS_END:
      return [
        ...withoutProject(state, action),
        {
          ...action.project,
          contributors: action.project.contributors.filter((contributor:any) => contributor.id !== action.user.id)
        }
      ];

    case UPDATE_PROJECT_STARS:
      const project = _find(state, _matchesProperty('id', action.id));

      return [
        ..._without(state, project),
        {...project, stargazers_count:  action.starsQuantity}
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
