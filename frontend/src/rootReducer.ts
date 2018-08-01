import { combineReducers } from 'redux';

import project from './reducers/project';
import oneproject from './reducers/oneproject';
import user from './reducers/user';

export default combineReducers({
  user,
  project,
  oneproject,
});
