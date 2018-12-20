import IEntity from '../../api/IEntity';

export default interface ISurveyEntity extends IEntity {
    getId():number;
    getCode():string;
    getText():string;
    getEnabled():string;
}