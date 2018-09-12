import { combineReducers } from 'redux';

import project from './reducers/project';
import user from './reducers/user';
import partners from './reducers/partners';
import messages from './reducers/messages';
import loading from './reducers/loading';

export default combineReducers({
  user,
  project,
  partners,
  messages,
  loading
});
