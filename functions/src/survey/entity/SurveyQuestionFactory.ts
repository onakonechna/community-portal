import SurveyQuestionEntity from './SurveyQuestion';
import IEntityFactory from '../../api/IEntityFactory'

export default class SurveyQuestionFactory implements IEntityFactory{
    public create(data:object) {
        return new SurveyQuestionEntity(data);
    }
}