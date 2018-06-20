import { combineReducers } from 'redux';

import project from './reducers/project';
import user from './reducers/user';

export default combineReducers({
  user,
  project,
});
