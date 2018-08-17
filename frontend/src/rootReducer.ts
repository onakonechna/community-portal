import { combineReducers } from 'redux';

import project from './reducers/project';
import oneproject from './reducers/oneproject';
import user from './reducers/user';
import partners from './reducers/partners';
import messages from './reducers/messages';

export default combineReducers({
    user,
    project,
    partners,
    messages,
    oneproject
});
