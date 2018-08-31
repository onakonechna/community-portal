import {ADD_MESSAGE, DELETE_MESSAGE} from "../types";

export default (state = {}, action: any) => {
  switch (action.type) {
    case ADD_MESSAGE:
      return action.data;
    case DELETE_MESSAGE:
      return {};
    default:
      return state;
  }
}
