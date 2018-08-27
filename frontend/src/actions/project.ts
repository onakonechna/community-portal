import {Dispatch} from "redux";
import {UPDATE_PROJECT_STARS} from "../../types/project";

export const updateProjectStars = (github_project_id:string, starsQuantity:number) => (dispatch:Dispatch) => dispatch({
  type: UPDATE_PROJECT_STARS,
  github_project_id,
  starsQuantity
});
