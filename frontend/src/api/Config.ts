declare const API_ENDPOINT: string;
declare const BACKEND_HOST: string;
export const API = API_ENDPOINT;
export const BACKEND_API = BACKEND_HOST;

import axios from 'axios';

function getToken() {
    const localToken = localStorage.getItem('oAuth');
    const token: any = localToken !== null ? JSON.parse(localToken) : '';
    return token;
}

export const headers = () => ({
    headers: {
        Authorization : getToken(),
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
    },
});

export const postHeaders = (data:any) => {
    return {
        data,
        method: 'post',
        headers: {
            Authorization: getToken(),
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
        },
    };
};

export const putHeaders = (data:any) => {
    return {
        data,
        method: 'put',
        headers: {
            Authorization: getToken(),
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
    };
};

export const deleteHeaders = (data:any) => {
    return {
        data,
        method: 'delete',
        headers: {
            Authorization: getToken(),
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
    };
};

export const request = (url: string, headers: any) => {
    return axios(url, headers).then((res: any) => {
        return res.data;
    });
};
