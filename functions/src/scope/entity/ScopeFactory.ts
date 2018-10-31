import ScopeEntity from './Scope';
import IEntityFactory from '../../api/IEntityFactory'

export default class ScopeEntityFactory implements IEntityFactory{
	public create(data:object) {
		return new ScopeEntity(data);
	}
}