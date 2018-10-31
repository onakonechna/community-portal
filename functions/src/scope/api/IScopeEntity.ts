import IEntity from '../../api/IEntity';

export default interface IScopeEntity extends IEntity {
	getId():number;
	getDescription():string;
	getScope():string;
}