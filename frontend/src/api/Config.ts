import axios from 'axios';

export const API = process.env.API_ENDPOINT_HOST;
export const BACKEND_API = process.env.BACKEND_ENDPOINT_HOST;

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
        },
    };
};

export const request = (url: string, headers: any) => {
    return axios(url, headers).then((res: any) => {
        return res.data;
    });
};
