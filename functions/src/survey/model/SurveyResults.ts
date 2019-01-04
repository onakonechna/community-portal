import SurveyResultsResource from '../resource/SurveyResults';
import SurveyResultsFactory from '../entity/SurveyResultsFactory';
import databaseConnection, { databaseTypes } from "../../DatabaseConnectionMariaDb";
import ISurveyResultsEntity from "../api/ISurveyResultsEntity";
import * as _ from "lodash";

export default class SurveyResults {
    private connection;
    private surveyResultsResource;
    private surveyResultsFactory;

    constructor() {
        this.connection = databaseConnection.connect();
        this.surveyResultsResource = SurveyResultsResource(this.connection, databaseTypes);
        this.surveyResultsFactory = new SurveyResultsFactory();
    }

    save(surveyResult:ISurveyResultsEntity):Promise<any> {
        return this.surveyResultsResource.create(surveyResult.getData()).then(() => surveyResult.getId());
    }

    saveBulk(surveyResultsBulk):Promise<any> {
        let toSave = [];
        _.map(surveyResultsBulk, function(value, index) {
            toSave.push(value.getData());
        });
        return this.surveyResultsResource.bulkCreate(toSave).then((affectedRows) => affectedRows);
    }

    checkIfAlreadyCompleted(surveyId:string, scope:any):Promise<any> {
        return this.surveyResultsResource.count({where: {survey_id : surveyId, scope: scope}}).then((count:any) => count > 0);
    }
}
