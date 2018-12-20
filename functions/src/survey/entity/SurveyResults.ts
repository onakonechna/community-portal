import ISurveyResultsEntity from '../api/ISurveyResultsEntity';

export default class SurveyResults implements ISurveyResultsEntity  {
    private data;

    constructor(data:any) {
        this.data = {
            id: data.id || null,
            survey_id: data.survey_id || '',
            option_id: data.option_id || '',
            value: data.value || '',
            user_id: data.user_id || '',
            scope: data.scope || ''
        };
    }

    set(data:object) {
        this.data = { ...this.data, ...data };
    }

    getId():number {
        return this.data.id;
    }

    getSurveyId():string {
        return this.data.survey_id;
    }

    getOptionId():string {
        return this.data.option_id;
    }

    getUserId() {
        return this.data.user_id;
    }

    getValue() {
        return this.data.value;
    }

    getScope() {
        return this.data.scope;
    }

    getData() {
        return this.data;
    }
}