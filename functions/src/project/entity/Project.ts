import * as _ from "lodash";
import IProjectEntity from "../api/IProjectEntity";

export default class Project implements IProjectEntity{
	private data;

	constructor(data:any) {
		this.data = {
			id: data.id,
			name: data.name,
			github_address: data.github_address || '',
			description: data.description || '',
			short_description: data.short_description || '',
			technologies: data.technologies || '',
			size: data.size || '',
			status: data.status || '',
			display: data.display || true,
			slack_channel: data.slack_channel || '',
			bookmarked: data.bookmarked || [],
			estimated: data.estimated || 0,
			contributors: data.contributors || [],
			ownerId: data.ownerId,
			createdAt: data.createdAt,
			updatedAt: data.updatedAt
		};
	}

	set(data:object) {
		this.data = { ...this.data, ...data };
	}

	getId() {
		return this.data.id;
	}

	getOwnerId() {
		return this.data.ownerId;
	}

	getDescription() {
		return this.data.description;
	}

	getContributors() {
		return this.data.contributors;
	}

	getGithubAddress() {
		return this.data.github_address;
	}

	getShortDescription() {
		return this.data.short_description;
	}

	getTechnologies() {
		return Array.isArray(this.data.technologies) ? this.data.technologies : JSON.parse(this.data.technologies);
	}

	getSize() {
		return this.data.size;
	}

	getStatus() {
		return this.data.status;
	}

	getDisplay() {
		return this.data.display;
	}

	getSlackChannel() {
		return this.data.slack_channel;
	}

	getEstimated() {
		return this.data.estimated;
	}

	getStargazersCount() {
		return this.data.stargazers_count;
	}

	getOrganizationName() {
		const splitGithubAddress = this.getGithubAddress().split('/');

		return splitGithubAddress[splitGithubAddress.length - 1] ?
			splitGithubAddress[splitGithubAddress.length - 2] :
			splitGithubAddress[splitGithubAddress.length - 3]
	}

	getRepositoryName() {
		const splitGithubAddress = this.getGithubAddress().split('/');

		return splitGithubAddress[splitGithubAddress.length - 1] ||
			splitGithubAddress[splitGithubAddress.length - 2];
	}

	getExistingData() {
		return _.pickBy(this.getData(), (val:any) => val);
	}

	getData() {
		return this.data;
	}
}