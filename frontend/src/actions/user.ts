import {
    LOAD_STARRED_PROJECTS_START,
    LOAD_STARRED_PROJECTS_END,
    LOGIN_START,
    LOGIN_END,
    LOGOUT
} from '../../types/user';
import { Dispatch } from 'redux';
import getStarredProjects from '../api/GetLikedProjects';
import GithubAuthModal, {toQuery} from "../components/GithubAuthModal";
import {BACKEND_API, postHeaders, request} from "../api/Config";

declare const __FRONTEND__: string;
declare const GITHUB_CLIENT_ID: string;
const gitId = GITHUB_CLIENT_ID;
const frontEnd = __FRONTEND__;

export const login = (type: any) => (dispatch:Dispatch) => {
    const scope = type == 'partner' ? 'user,admin:org,public_repo' : 'user:email,public_repo';
    const search = toQuery({
        client_id: gitId,
        redirect_uri: `${frontEnd}/auth`,
        scope,
    });

    dispatch({type: LOGIN_START});

    return GithubAuthModal.open(
        'github-oauth-authorize',
        `https://github.com/login/oauth/authorize?${search}`,
        { height: 1000, width: 600 },
    ).then((code:string) => {

        return request(`${BACKEND_API}/user/authorize`, postHeaders({'code': code}))
            .then((res:any) => {
                dispatch({
                    type: LOGIN_END,
                    token: res.token
                })
            });
    })
};

export const logout = () => (dispatch:Dispatch) => {
    dispatch({
        type: LOGOUT
    })
};

export const loadStarredProjects =  () => (dispatch:Dispatch) => {
    dispatch({
        type: LOAD_STARRED_PROJECTS_START
    });

    return getStarredProjects()
        .then((result:any) => dispatch({
            type: LOAD_STARRED_PROJECTS_END,
            projects: result.data
        }))
};
