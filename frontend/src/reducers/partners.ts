import {
  GET_PARTNER_TEAMS_LIST_END,
  GET_PARTNER_TEAM_END,
  DELETE_TEAM_START,
  SAVE_TEAM_END
} from '../types/partners';
import * as _ from 'lodash';


const defaultState = {
  teams: []
};

export default (state = defaultState, action: any) => {
  switch (action.type) {
    case GET_PARTNER_TEAMS_LIST_END:
      return {
        ...state,
        teams: action.teams,
      };
    case DELETE_TEAM_START:
      return {
        ...state,
        teams: _.reject(state.teams, {id: action.id})
      };
    case GET_PARTNER_TEAM_END:
      return {
        ...state,
        teams: [..._.reject(state.teams, {id: action.data.payload.data.id}), action.data.payload.data]
      };
    case SAVE_TEAM_END:
      return {
        ...state,
        teams: [...state.teams, action.data]
      };
    default:
      return state;
  }
}
