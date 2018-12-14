import SurveyResultsEntity from './SurveyResults';
import IEntityFactory from '../../api/IEntityFactory'

export default class SurveyResultsFactory implements IEntityFactory{
    public create(data:object) {
        return new SurveyResultsEntity(data);
    }
}