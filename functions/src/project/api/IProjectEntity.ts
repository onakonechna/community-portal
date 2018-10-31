import IEntity from '../../api/IEntity';

export default interface IProjectEntity extends IEntity {
	getId():number;
	getOwnerId():number;
	getContributors():any[];
	getGithubAddress():string;
	getDescription():string;
	getShortDescription():string;
	getTechnologies():any[];
	getSize():string;
	getStatus():string;
	getDisplay():boolean;
	getSlackChannel():string;
	getEstimated():number;
	getStargazersCount():number;
	getOrganizationName():string;
	getRepositoryName():string;
}