import ProjectEntity from './Project';

export default class ProjectEntityFactory {
	public create(data:object) {
		return new ProjectEntity(data);
	}
}