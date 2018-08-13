import axios, { AxiosResponse } from 'axios';
import {
  GET_PARTNER_TEAMS_LIST_START,
  GET_PARTNER_TEAMS_LIST_END,
  GET_PARTNER_TEAM_START,
  GET_PARTNER_TEAM_END,
  DELETE_TEAM_START,
  DELETE_TEAM_END,
  SAVE_TEAM_START,
  SAVE_TEAM_END
} from '../types/partners';

const domain = 'http://localhost:3000';

export const getPartnerTeamsList = () => (dispatch: any) => {
  dispatch({
    type: GET_PARTNER_TEAMS_LIST_START,
  });

  return axios.get(`${domain}/partners/teams/`)
    .then((res: AxiosResponse) => {
      dispatch({
        type: GET_PARTNER_TEAMS_LIST_END,
        teams: res.data.payload,
      });

      return res.data.payload;
    });
};

export const getPartnerTeam = (id:string) => (dispatch: any) => {
  dispatch({
    type: GET_PARTNER_TEAM_START,
  });

  return axios.get(`${domain}/partners/team/${id}`)
    .then((res: AxiosResponse) => {
      dispatch({
        type: GET_PARTNER_TEAM_END,
        team: res.data.payload.team,
      });

      return res.data.payload.team;
    });
};

export const deleteTeam = (id: number) => (dispatch: any) => {
  dispatch({
    id,
    type: DELETE_TEAM_START,
  });

  axios.post(`${domain}/partner-teams/delete/${id}`)
    .then((res: AxiosResponse) => {
      dispatch({
        id,
        type: DELETE_TEAM_END,
      });
    });
};

export const saveTeam = (data:any) => (dispatch: any) => {
  data.active = 1;

  dispatch({
    data,
    type: SAVE_TEAM_START
  });

  return axios.post(`${domain}/partners/team/save`, data)
    .then((res: AxiosResponse) => {
      dispatch({
        data,
        type: SAVE_TEAM_END,
      });

      console.log(res);
      return res.data;
    });
};
