class Day {
	getByTimestamp(timestamp) {
		return new Date(timestamp).getUTCDate();
	}
}

export default Day;