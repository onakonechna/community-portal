import SurveyResource from '../resource/Survey';
import SurveyFactory from '../entity/SurveyFactory';
import databaseConnection, { databaseTypes } from "../../DatabaseConnectionMariaDb";

export default class Survey {
    private connection;
    private surveyResource;
    private surveyFactory;

    constructor() {
        this.connection = databaseConnection.connect();
        this.surveyResource = SurveyResource(this.connection, databaseTypes);
        this.surveyFactory = new SurveyFactory();
    }

    getByCode(code:string):Promise<any> {
        return this.surveyResource
            .find({where: {code: code}})
            .then((resource:any) => this.surveyFactory.create(resource.get()));
    }
}
