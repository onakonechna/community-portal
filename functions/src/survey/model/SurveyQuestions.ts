import SurveyQuestionsResource from '../resource/SurveyQuestions';
import SurveyQuestionFactory from '../entity/SurveyQuestionFactory';
import databaseConnection, { databaseTypes } from "../../DatabaseConnectionMariaDb";
import {int} from "aws-sdk/clients/datapipeline";

export default class SurveyQuestions {
    private connection;
    private SurveyQuestionsResource;
    private surveyQuestionFactory;

    constructor() {
        this.connection = databaseConnection.connect();
        this.SurveyQuestionsResource = SurveyQuestionsResource(this.connection, databaseTypes);
        this.surveyQuestionFactory = new SurveyQuestionFactory();
    }

    getBySurveyId(id:int):Promise<any> {
        return this.SurveyQuestionsResource
            .findAll({where: {survey_id: id}})
            .then((collections) => collections.map((surveyResource) => this.surveyQuestionFactory.create(surveyResource.get())));
    }
}
