import * as _ from "lodash";

export default class Project {
	private data;

	constructor(data:object) {
		console.log(data);

		this.data = {
			id: data.id,
			github_address: data.github_address || '',
			short_description: data.short_description || '',
			technologies: data.technologies || '',
			size: data.size || '',
			status: data.status || '',
			display: data.display || true,
			slack_channel: data.slack_channel || '',
			bookmarked: data.bookmarked || [],
			estimated: data.estimated || 0,
			stargazers_count: data.stargazers_count || 0,
			contributors: data.contributors || [],
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