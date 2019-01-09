import axios, {AxiosResponse} from 'axios';
import {BACKEND_API as domain, request, headers} from '../api/Config';
import {
    GET_PARTNER_TEAMS_LIST_START,
    GET_PARTNER_TEAMS_LIST_END,
    GET_PARTNER_TEAM_START,
    GET_PARTNER_TEAM_END,
    DELETE_TEAM_START,
    DELETE_TEAM_END,
    SAVE_TEAM_START,
    SAVE_TEAM_END,
    VERIFY_PARTNER_USER_START,
    VERIFY_PARTNER_USER_END,
    EDIT_TEAM_START,
    EDIT_TEAM_END
} from '../types/partners';

export const getPartnerTeamsList = () => (dispatch: any) => {
    dispatch({
        type: GET_PARTNER_TEAMS_LIST_START,
    });

    return request(`${domain}/partners/teams`, headers())
        .then((res: AxiosResponse) => {
            dispatch({
                type: GET_PARTNER_TEAMS_LIST_END,
                teams: res,
            });

            return res;
        });
};

export const verifyPartnerUser = (userId: string) => (dispatch: any) => {
    dispatch({
        type: VERIFY_PARTNER_USER_START,
        user_id: userId
    });

    return axios.get(`${domain}/partners/user/verify/${userId}`)
        .then((res: AxiosResponse) => {
            dispatch({
                type: VERIFY_PARTNER_USER_END,
                data: res.data,
            });

            return res.data;
        });
};

export const getPartnerTeam = (id: string) => (dispatch: any) => {
    dispatch({
        type: GET_PARTNER_TEAM_START,
    });

    return axios.get(`${domain}/partners/team/${id}`)
        .then((res: AxiosResponse) => {
            dispatch({
                type: GET_PARTNER_TEAM_END,
                data: res,
            });

            return res;
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

export const saveTeam = (data: any) => (dispatch: any) => {
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

            return res.data;
        });
};


export const editTeam = (data: any) => (dispatch: any) => {
    dispatch({
        data,
        type: EDIT_TEAM_START
    });

    return axios.post(`${domain}/partners/team/edit`, data)
        .then((res: AxiosResponse) => {
            dispatch({
                data,
                type: EDIT_TEAM_END,
            });

            return res.data;
        });
};
