import IEntity from '../../api/IEntity';

export default interface ISurveyEntity extends IEntity {
    getId():number;
    getSurveyId():string;
    getText():string;
    getQuestionId():string;
    getOrder():string;
}