class Quarter {
	private list;

	constructor() {
		this.list = ['Q1', 'Q2', 'Q3', 'Q4'];
	}

	public getList() {
		return this.list;
	}

	public getMonthIndexes(quarter) {
		const from = quarter * 3,
					to = from + 3;

		return Array.apply(null, {length: 12}).map(Number.call, Number).slice(from, to);
	}

	public getFirstMonthIndex(quarter) {
		return this.getMonthIndexes(quarter)[0];
	}

	public getLastMonthIndex(quarter) {
		return this.getMonthIndexes(quarter)[2]
	}

	public getNameByMonth(month) {
		return this.getList()[this.getIndexByMonth(month)];
	}

	public getIndexByMonth(month) {
		return Math.floor(month/3);
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
		let i = this.getIndexByMonth(start);
		let result:any = [];

		for (i; i <= this.getIndexByMonth(end); i++) {
			result.unshift({ year, quarter: i, name: this.getList()[i]})
		}

		return result;
	}
}

export default Quarter;