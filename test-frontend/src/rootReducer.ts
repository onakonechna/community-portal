import { combineReducers } from 'redux';
import { 
	ADD_PROJECT,
	ADD_USER,
	PROJECTS_LOADED 
} from './actions';

function user (state = [], action:any) {
	if (action.type === ADD_USER) {
		return action.users;
	} else {return state}
}

function project (state = [{'text':'test'}], action:any) {
	switch(action.type) {
		case PROJECTS_LOADED:
			console.log('project loaded!');
			return action.projects;
		case ADD_PROJECT:
			return [
				...state,
				action.project
			];
		default:
			return state;
	}
}

export default combineReducers({
	user,
	project
});