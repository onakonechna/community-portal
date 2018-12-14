import {Dispatch} from "redux";
import {LOAD_START, LOAD_END, RESULTS_SAVE_START, RESULTS_SAVE_END, HANDLE_MESSAGE} from "../types/survey";
import {API, headers, postHeaders, request} from "../api/Config";

export const loadSurvey = (surveyId: string, scope: any) => (dispatch:Dispatch) => {
    dispatch({
        type: LOAD_START
    });

    return request(`${API}/survey/load/${surveyId}/${scope}`, headers())
        .then((result: any) => {
            dispatch({
                type: LOAD_END,
                survey: result
            });

            if (result.error) {
                dispatch({
                    type: HANDLE_MESSAGE,
                    error: result.error,
                    message: result.message
                });
            }
        });
};

export const saveResults = (data:any) => (dispatch:Dispatch) => {
    dispatch({
        type: RESULTS_SAVE_START
    });

    return request(`${API}/survey/results/save`, postHeaders(data))
        .then((result: any) => {
            dispatch({
                type: RESULTS_SAVE_END,
                isSaved: !result.error
            });

            if (result.error) {
                dispatch({
                    type: HANDLE_MESSAGE,
                    error: result.error,
                    message: result.message
                });
            } else {
                dispatch({
                    type: HANDLE_MESSAGE,
                    error: result.error,
                    message: result.message
                });
            }
        });
};

export const handleMessage = (message: string, isError: boolean) => (dispatch:Dispatch) => {
    dispatch({
        type: HANDLE_MESSAGE,
        error: isError,
        message: message
    });
};