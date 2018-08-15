import { ActionTypes, TypeKeys } from '../actions';

const defaultProject = {
    id: '',
    name: '',
    title: '',
    description: '',
    status: '',
    owner: '',
    technologies: [],
    pledgers: {},
    upvotes: 0,
    estimated: 8,
    pledged: 0,
    created: 1534364549470,
    due: 1534364600000,
    github: '',
    slack: '',
    size: 'S',
};

export default function oneproject(state = defaultProject, action:ActionTypes) {
  switch (action.type) {
    case TypeKeys.PROJECT_LOADED:
      return action.project;
    default:
      return state;
  }
}
