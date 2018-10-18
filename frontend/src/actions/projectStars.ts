import {Dispatch} from "redux";
import {API, request, deleteHeaders, postHeaders} from '../api/Config';
import {
	STAR_PROJECT_END,
	STAR_PROJECT_START,
	UNSTAR_PROJECT_END,
	UNSTAR_PROJECT_START
} from "../../types/projectStars";
import {UPDATE_PROJECT_STARS} from "../../types/projectStars";

export const starProject = (id:number) => (dispatch:Dispatch) => {
	dispatch({
		type: STAR_PROJECT_START,
		project_id: id
	});

	return request(`${API}/project/star`, postHeaders({id}))
		.then(() => {
			dispatch({
				type: STAR_PROJECT_END,
				project_id: id
			});
		})
};

export const updateProjectStars = (id:number, starsQuantity:number) => (dispatch:Dispatch) => dispatch({
	type: UPDATE_PROJECT_STARS,
	id,
	starsQuantity
});


export const unstarProject = (id:number) => (dispatch:Dispatch) => {
	dispatch({
		type: UNSTAR_PROJECT_START,
		project_id: id
	});

	return request(`${API}/project/star`, deleteHeaders({id}))
		.then(() => {
			dispatch({
				type: UNSTAR_PROJECT_END,
				project_id: id
			});
		})
};
