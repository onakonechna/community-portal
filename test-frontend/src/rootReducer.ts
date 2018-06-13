import { combineReducers } from 'redux';
import { ADD } from './actions';

function category (state = [], action:any) {
    if (action.type === ADD) {
      return action.categories;
    } else {return state}
  }

export default combineReducers({
    category
});