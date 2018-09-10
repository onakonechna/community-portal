import {
  ADD_STARRED_PROJECT,
  REMOVE_STARRED_PROJECT,
  LOAD_STARRED_PROJECTS_START,
  LOAD_STARRED_PROJECTS_END,
  LOGIN_START,
  LOGIN_END,
  LOGOUT
} from '../../types/user';
import { Dispatch } from 'redux';
import getStarredProjects from '../api/GetLikedProjects';
import GithubAuthModal, {toQuery} from "../components/GithubAuthModal";
import {API} from "../api/Config";
import axios from "axios";

declare const __FRONTEND__: string;
declare const GITHUB_CLIENT_ID: string;
const gitId = GITHUB_CLIENT_ID;
const frontEnd = __FRONTEND__;


export const login = () => (dispatch:Dispatch) => {
  const isAdmin = window.localStorage.getItem('partners-admin');
  const scope = isAdmin ? 'user,admin:org,public_repo' : 'user:email,public_repo';
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
    const params = isAdmin ? {code, 'partners-admin': isAdmin} : {code};

    return axios.post(`${API}/authorize`, params)
      .then((res:any) => {
        dispatch({
          type: LOGIN_END,
          token: res.data.token
        })
      });
  })
};

export const logout = () => (dispatch:Dispatch) => {
  dispatch({
    type: LOGOUT
  })
};

export const addStarredProject = (project:any) => (dispatch:Dispatch) => dispatch({
  type: ADD_STARRED_PROJECT,
  project
});

export const removeStarredProject = (github_id:string) => (dispatch:Dispatch) => dispatch({
  type: REMOVE_STARRED_PROJECT,
  github_id
});

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