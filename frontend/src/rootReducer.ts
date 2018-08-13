import { combineReducers } from 'redux';

import project from './reducers/project';
import user from './reducers/user';
import partners from './reducers/partners';

export default combineReducers({
    user,
    project,
    partners
});
