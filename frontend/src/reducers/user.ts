import { TypeKeys } from '../actions';
import * as _ from 'lodash';
import { decode } from 'jsonwebtoken';
import {
    LOAD_STARRED_PROJECTS_END,
    LOGIN_END,
    LOGOUT
} from '../../types/user';

import {
    STAR_PROJECT_END,
    UNSTAR_PROJECT_END
} from "../../types/projectStars";

const defaultUser = {
    id: '',
    user_id: '',
    avatar_url: '',
    name: '',
    role: 'guest',
    likedProjects: [],
    bookmarkedProjects: [],
    scopes: [],
    upvoted_projects: []
};

export default function user(state = defaultUser, action:any) {
    switch (action.type) {
        case TypeKeys.LOAD_USER:
            return Object.assign({}, state, action.user);
        case TypeKeys.UPDATE_USER_ROLE:
            return Object.assign({}, state, {
                role: action.role,
            });
        case TypeKeys.UPDATE_USER_SCOPES:
            return Object.assign({}, state, {
                scopes: action.scopes,
            });
        case TypeKeys.LOAD_LIKED_PROJECTS:
            return Object.assign({}, state, {
                likedProjects: action.projects,
            });
        case LOGOUT:
            window.localStorage.removeItem('oAuth');

            return {};
        case LOGIN_END:
            window.localStorage.setItem('oAuth', JSON.stringify(action.token));
            const user = decode(action.token) as any;

            return {...user, user_id: user.id.toString()};
        case LOAD_STARRED_PROJECTS_END:
            return {
                ...state,
                upvoted_projects: action.projects
            };
        case STAR_PROJECT_END:
            return {
                ...state,
                upvoted_projects: [
                    ...state.upvoted_projects,
                    {id: action.project_id}
                ]
            };
        case UNSTAR_PROJECT_END:
            return {
                ...state,
                upvoted_projects: _.filter(state.upvoted_projects, (project:any) => project.id !== action.project_id)
            };
        case TypeKeys.LOAD_BOOKMARKED_PROJECTS:
            return Object.assign({}, state, {
                bookmarkedProjects: action.projects,
            });
        default:
            return state;
    }
}
