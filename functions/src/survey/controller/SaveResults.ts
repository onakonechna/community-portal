import {Request, Response} from '../../../config/Types';
import IController from '../../api/IController';
import User from "../../user/model/User";
import SurveyResults from "../model/SurveyResults";
import * as _ from "lodash";
import SurveyResultsFactory from "../entity/SurveyResultsFactory";

export default class SaveResultsController implements IController {

    private user;
    private surveyResults;
    private surveyResultsFactory;

    constructor() {
        this.user = new User();
        this.surveyResults = new SurveyResults();
        this.surveyResultsFactory = new SurveyResultsFactory();
    }

	public execute(req: Request, res: Response) {
	    this.user.getById(req.tokenContents.id).then((user) => {

	        let dataToSave = [],
                self = this;

            _.map(req.body.selected, function (value, index) {
                let row = self.surveyResultsFactory.create({
                    user_id: user.getId(),
                    survey_id: req.body.survey_id,
                    option_id: index,
                    scope: req.body.scope,
                    value: value
                });
                self.surveyResults.save(row);
                dataToSave.push(row);
            });

            return res.status(200).json(
                {
                    error: false,
                    message: 'Your results successfully saved!'
                });
        });

	}
}
