class Month {
	private list;

	constructor() {
		this.list = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
	}

	public getList() {
		return this.list;
	}

	public getNameByIndex(index) {
		return this.getList()[index];
	}

	public getByTimestamp(timestamp) {
		return new Date(timestamp).getUTCMonth();
	}

	public getDaysQuantity(year, month) {
		return new Date(year, month + 1, 0).getDate()
	}

	public getByRange(startYear, endYear, startMonth, endMonth) {
		let i = startYear;
		let result:any = [];

		for (i; i <= endYear; i++) {
			result = [
				...this.getInYear(i, i === startYear ? startMonth : 0, i === endYear ? endMonth : 11),
				...result
			];
		}

		return result;
	}

	public getInYear(year, start = 0, end = 11) {
		let i = start;
		let result:any = [];

		for (i; i <= end; i++) {
			result.unshift({ year, month: i, name: this.getList()[i]})
		}

		return result;
	}
}

export default Month;