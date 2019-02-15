class Year {
	public getByTimestamp(timestamp) {
		return new Date(timestamp).getUTCFullYear()
	}

	public getByRange(startYear, endYear) {
		let i = startYear;
		let result:any = [];

		for (i; i <= endYear; i++) {
			result.unshift({year: i});
		}

		return result;
	}
}

export default Year;