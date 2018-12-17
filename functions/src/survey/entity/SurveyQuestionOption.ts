import ISurveyQuestionOptionsEntity from '../api/ISurveyQuestionOptionsEntity';

export default class SurveyQuestionOption implements ISurveyQuestionOptionsEntity  {
    private data;

    constructor(data:any) {
        this.data = {
            id: data.id || null,
            survey_id: data.survey_id || '',
            text: data.text || '',
            question_id: data.question_id || '',
            order: data.order || ''
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

    getText():string {
        return this.data.text;
    }

    getQuestionId() {
        return this.data.question_id;
    }

    getOrder() {
        return this.data.order;
    }

    getData() {
        return this.data;
    }
}