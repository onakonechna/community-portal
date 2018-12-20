import * as _ from "lodash";
import ISurveyQuestionEntity from '../api/ISurveyQuestionEntity';

export default class SurveyQuestion implements ISurveyQuestionEntity  {
    private data;

    constructor(data:any) {
        this.data = {
            id: data.id || null,
            survey_id: data.survey_id || '',
            text: data.text || '',
            type: data.type || '',
            is_required: data.is_required || null
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

    getType() {
        return this.data.type;
    }

    getIsRequired(): number {
        return this.data.is_required;
    }

    getData() {
        return this.data;
    }
}