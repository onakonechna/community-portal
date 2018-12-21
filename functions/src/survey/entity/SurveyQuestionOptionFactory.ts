import SurveyQuestionOptionEntity from './SurveyQuestionOption';
import IEntityFactory from '../../api/IEntityFactory'

export default class SurveyQuestionOptionFactory implements IEntityFactory{
    public create(data:object) {
        return new SurveyQuestionOptionEntity(data);
    }
}