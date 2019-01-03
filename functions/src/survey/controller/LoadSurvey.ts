import {Request, Response} from '../../../config/Types';
import IController from '../../api/IController';
import SurveyModel from '../model/Survey';
import SurveyEntity from '../entity/Survey';
import SurveyQuestionsModel from '../model/SurveyQuestions';
import SurveyQuestionOptionsModel from '../model/SurveyQuestionOptions';
import SurveyResults from '../model/SurveyResults';
import GitHub from "../../services/Github";
import User from "../../user/model/User";
import * as _ from 'lodash';

export default class LoadSurveyController implements IController {

    private surveyModel;
    private surveyQuestionsModel;
    private surveyQuestionOptionsModel;
    private surveyResultsModel;
    private gitHub;
    private user;

    constructor() {
        this.surveyModel = new SurveyModel();
        this.surveyQuestionsModel = new SurveyQuestionsModel();
        this.surveyQuestionOptionsModel = new SurveyQuestionOptionsModel();
        this.surveyResultsModel = new SurveyResults();
        this.gitHub = new GitHub();
        this.user = new User();
    }

	public execute(req: Request, res: Response) {
        // Load survey model by survey code
        this.surveyModel.getByCode(req.params.survey_id)
            .then((entity:SurveyEntity) => {
                this.surveyResultsModel.checkIfAlreadyCompleted(entity.getId(), req.params.scope)
                    .then((result:boolean) => {
                        // Verify if the survey already completed by the author.
                        if (result === true) {
                            return res.status(200).json(
                                {
                                    error: true,
                                    message: 'Survey already completed for this Pull Request'
                                });
                        }

                        this.user.getById(req.tokenContents.id).then((user) => {
                            let repoDetails = req.params.scope.split('+');
                            this.gitHub.getPullRequestDetails(
                                repoDetails[0],
                                repoDetails[1],
                                repoDetails[2],
                                user.getAccessToken()
                            ).then((pr: any) => {
                                // Verify PR owner
                                if (pr.user.login !== user.getLogin()) {
                                    return res.status(200).json(
                                        {
                                            error: true,
                                            message: 'Only the pull request author has access to the survey'
                                        });
                                }
                                // Load survey and add to the response
                                this.surveyQuestionsModel.getBySurveyId(entity.getId())
                                    .then((questions:any) =>{
                                        this.surveyQuestionOptionsModel.getOptionsBySurveyId(entity.getId())
                                            .then((options:any) => {
                                                _.map(questions, function (question, i) {
                                                    question.set({options: []});
                                                    _.map(options, function (option, k) {
                                                        if (option.getQuestionId() === question.getId()) {
                                                            question.getData().options.push(option);
                                                        }
                                                    })
                                                });

                                                return res.status(200).json(
                                                    {
                                                        error: false,
                                                        entity: {
                                                            body: entity,
                                                            questions: questions
                                                        }
                                                    });
                                            });
                                    });
                            }).catch((error: any) => {
                                return res.status(200).json({
                                    error: true,
                                    message: 'Survey not found. Please, check the link and try again.'
                                });
                            });
                        });
                    });
            })
            .catch((err: any) => {
                res.status(200).json({
                    error: true,
                    message: err
                })
            });
	}
}
