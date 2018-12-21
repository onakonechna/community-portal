import SurveyEntity from './Survey';
import IEntityFactory from '../../api/IEntityFactory'

export default class SurveyFactory implements IEntityFactory{
    public create(data:object) {
        return new SurveyEntity(data);
    }
}