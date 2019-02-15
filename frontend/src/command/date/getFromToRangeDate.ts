export default (collection:any[]) => {
	let start = 0;
	let end = 0;

	collection.forEach((item:any) => {
		let date;

		item.merged.forEach((el:any) => {
			if (!el.points) {
				return;
			}

			date = new Date(el.closed_at).getTime();

			if (!start || start > date) {
				start = date;
			} else if (date > end) {
				end = date;
			}
		})
	});

	return { start, end };
};