import * as _ from 'lodash';
import {
  LOADING_PROCESS_START,
  LOADING_PROCESS_END,
} from '../types';

export default (state = {}, action:any) => {
  switch (action.type) {
    case LOADING_PROCESS_START:
      return {
        ...state,
        [action.loading.type]: {
          global: action.loading.global
        },
      };
    case LOADING_PROCESS_END:
      return {
        ..._.omit(state, action.loading)
      };
    default:
      return state;
  }
};
