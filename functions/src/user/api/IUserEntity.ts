import IEntity from '../../api/IEntity';

export default interface IUserEntity extends IEntity {
	getId():number;
	getAvatarUrl():string;
	getCompany():string;
	getEmail():string;
	getLocation():string;
	getName():string;
	getTwoFactorAuthentication():boolean;
	getAccessToken():string;
	getLogin():string;
	getStars():any[];
	getScopes();
	getUrl():string;
	getSecureData();
}