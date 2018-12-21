import {
    LOAD_START,
    LOAD_END,
    RESULTS_SAVE_START,
    RESULTS_SAVE_END,
    HANDLE_MESSAGE,
    CLEAR_MESSAGE
} from '../types/survey';

export default function project(state = [], action:any) {
    switch (action.type) {
        case LOAD_START:
            return {
                ...state,
                surveyLoading: true
            };
        case LOAD_END:
            return {
                ...state,
                surveyLoading: false,
                entity: action.survey.entity
            };
        case RESULTS_SAVE_START:
            return {
                ...state,
                surveySaving: true
            };
        case RESULTS_SAVE_END:
            return {
                ...state,
                surveySaving: false,
                isSaved: action.isSaved
            };
        case HANDLE_MESSAGE:
            return {
                ...state,
                surveyError: action.error,
                surveyMessage: action.message,
            };

        case CLEAR_MESSAGE:
            return {
                ...state,
                surveyError: false,
                surveyMessage: null,
            };
        default:
            return state;
    }
}
