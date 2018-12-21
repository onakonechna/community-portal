import SurveyQuestionOptionsResource from '../resource/SurveyQuestionOptions';
import SurveyQuestionOptionFactory from '../entity/SurveyQuestionOptionFactory';
import databaseConnection, { databaseTypes } from "../../DatabaseConnectionMariaDb";
import {int} from "aws-sdk/clients/datapipeline";

export default class SurveyQuestionOptions {
    private connection;
    private surveyQuestionOptionsResource;
    private surveyQuestionOptionsFactory;

    constructor() {
        this.connection = databaseConnection.connect();
        this.surveyQuestionOptionsResource = SurveyQuestionOptionsResource(this.connection, databaseTypes);
        this.surveyQuestionOptionsFactory = new SurveyQuestionOptionFactory();
    }

    getOptionsBySurveyId(surveyId:int):Promise<any> {
        return this.surveyQuestionOptionsResource
            .findAll({where: {survey_id: surveyId}})
            .then((collections) => collections.map((surveyOptionsResource) => this.surveyQuestionOptionsFactory.create(surveyOptionsResource.get())));
    }
}
