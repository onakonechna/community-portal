import * as _ from "lodash";
import ISurveyEntity from '../api/ISurveyEntity';

export default class Survey implements ISurveyEntity  {
    private data;

    constructor(data:any) {
        this.data = {
            id: data.id || null,
            code: data.code || '',
            text: data.text || '',
            enabled: data.enabled || ''
        };
    }

    set(data:object) {
        this.data = { ...this.data, ...data };
    }

    getId():number {
        return this.data.id;
    }

    getCode():string {
        return this.data.code;
    }

    getText():string {
        return this.data.text;
    }

    getEnabled() {
        return this.data.enabled;
    }

    getData() {
        return this.data;
    }
}