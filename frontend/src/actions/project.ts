import {Dispatch} from "redux";
import {API, request, deleteHeaders, postHeaders} from '../api/Config';
import {
  UPDATE_PROJECT_STARS,
  UNJOIN_TO_PROJECT_CONTRIBUTORS_START,
  UNJOIN_TO_PROJECT_CONTRIBUTORS_END,
  JOIN_TO_PROJECT_CONTRIBUTORS_START,
  JOIN_TO_PROJECT_CONTRIBUTORS_END
} from "../../types/project";


export const updateProjectStars = (github_project_id:string, starsQuantity:number) => (dispatch:Dispatch) => dispatch({
  type: UPDATE_PROJECT_STARS,
  github_project_id,
  starsQuantity
});

export const unjoinProject = (project:any, user:any) => (dispatch:Dispatch) => {
  dispatch({
    type: UNJOIN_TO_PROJECT_CONTRIBUTORS_START,
    project,
    user
  });

  return request(`${API}/project/join`, deleteHeaders({project_id: project.github_project_id}))
    .then(() => {
      dispatch({
        type: UNJOIN_TO_PROJECT_CONTRIBUTORS_END,
        project,
        user
      })
    })
};

export const joinProject = (project:any, user:any) => (dispatch:Dispatch) => {
  dispatch({
    type: JOIN_TO_PROJECT_CONTRIBUTORS_START,
    project,
    user
  });

  return request(`${API}/project/join`, postHeaders({project_id: project.github_project_id}))
    .then((response:any) => {
      dispatch({
        type: JOIN_TO_PROJECT_CONTRIBUTORS_END,
        project,
        user
      })
    })
};