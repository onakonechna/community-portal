import SurveyResultsResource from '../resource/SurveyResults';
import SurveyResultsFactory from '../entity/SurveyResultsFactory';
import databaseConnection, { databaseTypes } from "../../DatabaseConnectionMariaDb";
import ISurveyResultsEntity from "../api/ISurveyResultsEntity";

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

    checkIfAlreadyCompleted(surveyId:string, scope:any):Promise<any> {
        return this.surveyResultsResource.count({where: {survey_id : surveyId, scope: scope}}).then((count:any) => count > 0);
    }
}
