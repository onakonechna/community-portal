export default (collection:any[], start:number, end:number) => collection.map((item: any) => {
	const data: any = {};

	data.merged = item.merged.filter((el: any) => new Date(el.closed_at).getTime() >= start && new Date(el.closed_at).getTime() <= end);
	data.closed = item.closed.filter((el: any) => new Date(el.closed_at).getTime() >= start && new Date(el.closed_at).getTime() <= end);
	data.points = 0;
	data.merged.forEach((el: any) => data.points += el.points);
	data.repository = item.repository;

	return data;
});