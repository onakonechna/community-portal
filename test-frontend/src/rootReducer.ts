import { combineReducers } from 'redux';

import { ActionTypes, TypeKeys } from './actions';

function user (state = [], action:ActionTypes) {
	switch(action.type) {
		case TypeKeys.ADD_USER:
			return action.users;
		default:
			return state;
	}

}

function project (state = [{'text':'test'}], action:ActionTypes) {
	switch(action.type) {
		case TypeKeys.PROJECTS_LOADED:
			console.log('project loaded!');
			return action.projects;
		case TypeKeys.ADD_PROJECT:
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