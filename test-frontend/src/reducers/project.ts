import { ActionTypes, TypeKeys } from '../actions';

export default function project (state = [], action:ActionTypes) {
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
