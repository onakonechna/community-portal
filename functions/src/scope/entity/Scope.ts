import * as _ from "lodash";
import IScopeEntity from '../api/IScopeEntity';

export default class Scope implements IScopeEntity  {
	private data;

	constructor(data:any) {
		this.data = {
			id: data.id || null,
			description: data.description || '',
			scope: data.scope || ''
		};
	}

	set(data:object) {
		this.data = { ...this.data, ...data };
	}

	getId():number {
		return this.data.id;
	}

	getScope():string {
		return this.data.scope;
	}

	getDescription():string {
		return this.data.company;
	}

	getExistingData() {
		return _.pickBy(this.getData(), (val:any) => val);
	}

	getData() {
		return this.data;
	}
}