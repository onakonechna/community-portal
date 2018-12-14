import IEntity from '../../api/IEntity';

export default interface ISurveyResultsEntity extends IEntity {
    getId():number;
    getUserId():string;
    getSurveyId():string;
    getOptionId():string;
    getValue():string;
    getScope():string;
}