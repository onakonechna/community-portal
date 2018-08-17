import {ADD_MESSAGE, DELETE_MESSAGE} from "../types";

export const addMessage = (data:any) => (dispatch: any) => dispatch({
  type: ADD_MESSAGE,
  data
});

export const deleteMessage = () => (dispatch: any) => dispatch({
  type: DELETE_MESSAGE
});