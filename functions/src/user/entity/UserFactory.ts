import UserEntity from './User';
import IEntityFactory from '../../api/IEntityFactory'

export default class UserEntityFactory implements IEntityFactory{
	public create(data:object) {
		return new UserEntity(data);
	}
}