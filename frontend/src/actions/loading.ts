import {Dispatch} from "redux";
import {
  LOADING_PROCESS_START,
  LOADING_PROCESS_END
} from '../types';

export const loadingProcessStart = (type:string, global:boolean) => (dispatch:Dispatch) => dispatch({
  type: LOADING_PROCESS_START,
  loading: {
    type,
    global
  }
});

export const loadingProcessEnd = (type:string) => (dispatch:Dispatch) => dispatch({
  type: LOADING_PROCESS_END,
  loading: type
});
