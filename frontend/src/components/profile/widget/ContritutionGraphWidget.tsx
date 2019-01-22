import * as React from "react";
import {withStyles} from "@material-ui/core/styles";
import {Line} from 'react-chartjs-2';
import CardContent from "@material-ui/core/CardContent/CardContent";
import Card from "@material-ui/core/Card/Card";
import Divider from "@material-ui/core/Divider/Divider";
import PeriodSelect from "./PeriodSelect";
import ButtonsBar from "./ButtonsBar";
import MuiPickersUtilsProvider from "material-ui-pickers/utils/MuiPickersUtilsProvider";
import DateFnsUtils from "material-ui-pickers/utils/date-fns-utils";
import DatePicker from "material-ui-pickers/DatePicker/DatePickerWrapper";
import MultipleSelect from './MultipleSelect'
import _filter from 'lodash/filter';
import _includes from 'lodash/includes';
import _uniq from 'lodash/uniq';


const styles = (theme:any) => ({
	marginRight15: {
		'margin-right': '15px'
	},
	repositorySelectWidth: {
		'min-width': '150px'
	},
	graphWrapper: {},
	widgetCard: {
		'background': '#fff',
		'display': 'inline-block',
		'font-family': 'system-ui',
		'color': '#6b6868',
		'font-size': '14px',
		'margin': '10px',
		'width': '800px',
		'min-width': '530px',
	},
	widgetCardTitle: {
		'font-size': '16px',
		'display': 'inline-block',
		'color': '#6b6868',
		'font-family': 'system-ui',
		'font-weight': 'bold',
	},
	widgetCardPeriod: {
		'font-size': '14px',
		'display': 'inline-block',
		'color': '#6b6868',
		'font-family': 'system-ui',
	},
	widgetCardRange: {
		display: 'flex'
	},
	textField: {
		'width': '70px'
	},
	date: {
		width: '73px',
		cursor: 'pointer',
		color: '#6b6868',
		'font-size': '13px',
		'&:before': {
			bottom: '3px'
		},
		'&:after': {
			bottom: '3px'
		}
	},
	header: {
		'padding-bottom': '10px',
		display: 'flex',
		'justify-content': 'space-between',
		'vertical-align': 'middle',
		'align-items': 'center',
		'flex-wrap': 'wrap'
	},
	redBox: {
		height: '35px',
		color: '#fff',
		padding: '10px',
		background: '#ff5700',
		'box-sizing': 'border-box',
		'border-radius': '4px',
		'font-weight': 'bold',
		'vertical-align': 'middle'
	},
	blueBox: {
		color: '#fff',
		padding: '5px',
		background: '#27a7ff',
		'box-sizing': 'border-box',
		'border-radius': '4px',
		'font-weight': 'bold',
		'vertical-align': 'middle',
		'display': 'inline-block',
		'margin': '5px',
		'width': '45px',
		'text-align': 'center'
	},
	widgetRepositoryContainer: {
		display: 'inline-block',
		'vertical-align': 'middle',
		'margin-top': '10px',
		'width': '100%'
	},
	widgetRepositoryItem: {
		display: 'inline-block',
		'vertical-align': 'middle',
		'width': '50%',
		'overflow': 'hidden'
	},
	inlineBlock: {
		display: 'inline-block'
	},
	underline: {
		'border-bottom': '1px solid #6b6868',
		'padding-bottom': '3px',
		cursor: 'pointer'
	},
	secondLine: {
		'margin': '15px 0',
		'padding-bottom': '0'
	},
	mobileButtonContainer: {
		['@media (max-width: 620px)']: {
			'min-width': '100%'
		}
	},
	mobileSelectsContainer: {
		['@media (max-width: 620px)']: {
			'min-width': '100%',
			'& > div': {
				width: '50%',
				'& > div': {
					width: '98%'
				}
			}
		}
	}
});

class ContritutionGraphWidget extends React.Component<any, any> {
	private quorters:string[];
	private month:string[];
	private range:any;
	private repositories:any[];

	constructor(props:any) {
		super(props);

		//this.cache = {};
		this.state = {};
		this.repositories = [];
		this.quorters = ['Q1', 'Q2', 'Q3', 'Q4'];
		this.month = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

		this.state = {
			selectList: [],
			selectValue: '',
			customRange: false,
			periodType: 'month',
			repository: []
		}
	}

	componentWillReceiveProps(props:any) {
		if (!this.props.statistic.length && props.statistic.length) {
			this.range = this.getPeriodRange(props.statistic);

			this.repositories = props.statistic.map((item:any) => item.repository);
			this.setState({repository: this.repositories})
			this.onPeriodTypeChange(this.state.periodType);
		}
	}

	onPeriodTypeChange = (period:string) => {
		if (period === 'month') {
			const value = `${this.range.month.end + 1}/01/${this.range.years.fullEnd.getFullYear()}`;

			this.setState({
				customRange: false,
				selectList: this.getMonthList(),
				selectValue: value
			});

			this.onActiveMonthPeriodChange(value);
		}

		if (period === 'quorter') {
			const value = `${this.getQuorterByMonth(this.range.month.end) + 1}/${this.range.years.fullEnd.getFullYear()}`

			this.setState({
				customRange: false,
				selectList: this.getQuortersList(),
				selectValue: value
			});

			this.onActiveQuorterPeriodChange(value);
		}

		if (period === 'year') {
			const value = this.range.years.fullEnd.getFullYear();

			this.setState({
				customRange: false,
				selectList: this.getYearsList(),
				selectValue: value
			});

			this.onActiveYearPeriodChange(value)
		}

		if (period === 'custom') {
			this.setState({
				customRange: true,
				start_date:  this.range.years.start,
				end_date: this.range.years.end
			})
		}

		this.setState({
			periodType: period
		})
	};

	onActiveMonthPeriodChange = (value:string) => {
		const date = new Date(value);
		const year = date.getFullYear();
		const month = date.getMonth();

		this.setState({
			start_date: date,
			end_date: `${month + 1}/31/${year}`,
			selectValue: value
		});
	};

	onActiveQuorterPeriodChange = (value:string) => {
		const quorter = value.split('/')[0];
		const year = value.split('/')[1];
		const startMonth = this.getFirstMonthInQuorter(quorter);
		const endMonth = this.getLastMonthInQuorter(quorter);

		this.setState({
			start_date: `${startMonth}/01/${year}`,
			end_date: `${endMonth}/31/${year}`,
			selectValue: value
		});
	};

	onActiveYearPeriodChange = (value:string) => {
		this.setState({
			start_date: `01/01/${value}`,
			end_date: `12/31/${value}`,
			selectValue: value
		});
	};

	onActivePeriodChange = (event:any) => {
		if (this.state.periodType === 'month') {
			this.onActiveMonthPeriodChange(event.target.value);
		}

		if (this.state.periodType === 'quorter') {
			this.onActiveQuorterPeriodChange(event.target.value);
		}

		if (this.state.periodType === 'year') {
			this.onActiveYearPeriodChange(event.target.value);
		}
	};

	getFirstMonthInQuorter = (quorter:string) => {
		switch (quorter) {
			case '1':
				return 1;
			case '2':
				return 4;
			case '3':
				return 7;
			case '4':
				return 10;
			default:
				return 1;
		}
	};

	getMonthInQuorter = (quorter:number) => {
		switch (quorter) {
			case 1:
				return [1, 2, 3];
			case 2:
				return [4, 5, 6];
			case 3:
				return [7, 8, 9];
			case 4:
				return [10, 11, 12];
			default:
				return [1, 2, 3];
		}
	};

	getLastMonthInQuorter = (quorter:string) => {
		switch (quorter) {
			case '1':
				return 3;
			case '2':
				return 6;
			case '3':
				return 9;
			case '4':
				return 12;
			default:
				return 3;
		}
	};

	getYearsList = () => {
		let yearStart = this.range.years.fullStart.getFullYear();
		let yearEnd = this.range.years.fullEnd.getFullYear();
		let firstIterator = yearStart;
		let result: any[] = [];

		for (firstIterator; firstIterator <= yearEnd; firstIterator++) {
			result.unshift({
				label: firstIterator,
				value: firstIterator
			})
		}

		return result;
	};

	getQuortersList = () => {
		let yearStart = this.range.years.fullStart.getFullYear();
		let yearEnd = this.range.years.fullEnd.getFullYear();
		let firstIterator = yearStart;
		let result: any[] = [];
		let secondIterator;
		let monthEnd;

		for (firstIterator; firstIterator <= yearEnd; firstIterator++) {
			secondIterator = firstIterator === yearStart ? this.getQuorterByMonth(this.range.month.start): 0;
			monthEnd = firstIterator === yearEnd ? this.getQuorterByMonth(this.range.month.end) : this.quorters.length - 1;

			for (secondIterator; secondIterator <= monthEnd; secondIterator++) {
				result.unshift({
					label: `${this.quorters[secondIterator]} ${firstIterator}`,
					value: `${secondIterator + 1}/${firstIterator}`
				})
			}
		}

		return result;
	};

	getMonthList = () => {
		let yearStart = this.range.years.fullStart.getFullYear();
		let yearEnd = this.range.years.fullEnd.getFullYear();
		let firstIterator = yearStart;
		let result: any[] = [];
		let secondIterator;
		let monthEnd;

		for (firstIterator; firstIterator <= yearEnd; firstIterator++) {
			secondIterator = firstIterator === yearStart ? this.range.month.start : 0;
			monthEnd = firstIterator === yearEnd ? this.range.month.end + 1 : this.month.length;

			for (secondIterator; secondIterator < monthEnd; secondIterator++) {
				result.unshift({
					label: `${this.month[secondIterator]} ${firstIterator}`,
					value: `${secondIterator + 1}/01/${firstIterator}`
				})
			}
		}

		return result;
	};

	getPeriodRange = (collection:any[]) => {
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

		const startDate = new Date(start);
		const endDate = new Date(end);

		return {
			years: {
				start,
				end,
				fullStart: startDate,
				fullEnd: endDate
			},
			month: {
				start: startDate.getMonth(),
				end: endDate.getMonth()
			},
			quorter: {
				start: this.getQuorterByMonth(startDate.getMonth()),
				end: this.getQuorterByMonth(endDate.getMonth())
			}
		}
	};

	getQuorterByMonth = (month:number) => {
		if (month >= 0 && month <= 2) {
			return 0;
		}

		if (month >= 3 && month <= 5) {
			return 1;
		}

		if (month >= 6 && month <= 8) {
			return 2;
		}

		return 3;
	};

	handleStartDateChange = (date:Date) => {
		this.setState({
			start_date: date
		});
	};

	handleEndDateChange = (date:Date) => {
		this.setState({
			end_date: date
		});
	};

	filterPeriod = (start:number, end:number, data?:any[]) => {
		const pullRequestData = data || this.props.statistic;

		if (!pullRequestData.length) {
			return [];
		}

		return pullRequestData.map((item: any) => {
			const data: any = {};

			data.merged = item.merged.filter((el: any) => new Date(el.closed_at).getTime() >= start && new Date(el.closed_at).getTime() <= end);
			data.closed = item.closed.filter((el: any) => new Date(el.closed_at).getTime() >= start && new Date(el.closed_at).getTime() <= end);
			data.points = 0;
			data.merged.forEach((el: any) => data.points += el.points);
			data.repository = item.repository;

			return data;
		});
	};

	getLabels1 = (statistic:any[]) => {
		let merged:any[] = [];
		let closed: any[] = [];
		let mergedCount:any = 0;
		let closedCount:any = 0;
		let labels:any = [];
		let mapMerged:any = {};
		let mapClosed:any = {};

		this.filterPeriod(new Date(this.state.start_date).getTime(), new Date(this.state.end_date).getTime(), statistic).forEach((item:any) => {
			merged = [...merged, ...item.merged];
			closed = [...closed, ...item.closed];
		});

		merged.sort((first:any, second:any) =>  new Date(first.closed_at).getTime() - new Date(second.closed_at).getTime());
		closed.sort((first:any, second:any) =>  new Date(first.closed_at).getTime() - new Date(second.closed_at).getTime());

		[...merged, ...closed]
			.sort((first:any, second:any) =>  new Date(first.closed_at).getTime() - new Date(second.closed_at).getTime())
			.forEach((item:any) => {
				const date = new Date(item.closed_at);
				const month = this.month[date.getMonth()];
				const day = date.getDate();

				labels.push(`${day} ${month}`)
			});

		merged.forEach((item:any) => {
			const date = new Date(item.closed_at);
			const month = this.month[date.getMonth()];
			const day = date.getDate();

			mergedCount++;
			mapMerged[`${day} ${month}`] = mergedCount;
		});
		closed.forEach((item:any) => {
			const date = new Date(item.closed_at);
			const month = this.month[date.getMonth()];
			const day = date.getDate();

			closedCount++;
			mapClosed[`${day} ${month}`] = closedCount;
		});

		let closedDate:any[] = [];
		let data:any[] = [];
		let previos = 0;
		let previosData = 0;
		labels.forEach((item:any) => {
			if (!mapMerged[item]) {
				data.push({
					x: item,
					y: previosData
				})
			} else {
				previosData = mapMerged[item];

				data.push({
					x: item,
					y: mapMerged[item]
				})
			}

			if (!mapClosed[item]) {
				closedDate.push({
					x: item,
					y: previos
				})
			} else {
				previos = mapClosed[item];

				closedDate.push({
					x: item,
					y: mapClosed[item]
				})
			}
		});


		return {
			labels,
			data,
			closed: closedDate
		}
	};

	getLabels2 = () => {
		let mergedData:any[] = [];
		let closedData:any[] = [];
		let previosMerged:number = 0;
		let previosClosed:number = 0;
		let statistic:any[];

		statistic = _filter(this.props.statistic, (val:any) => _includes(this.state.repository, val.repository));

		if (this.state.periodType === 'year') {
			this.month.forEach((item:string, index:number) => {
				let tmpMerged:any[] = [];
				let tmpClosed:any[] = [];
				let filteredData = this.filterPeriod(new Date(`01/${item}${this.state.selectValue}`).getTime(), new Date(`01/${this.month[index+ 1]}${this.state.selectValue}`).getTime(), statistic);

				filteredData.forEach((item:any) => {
						tmpMerged = [...tmpMerged, ...item.merged];
						tmpClosed = [...tmpClosed, ...item.closed];
					});

				previosMerged += tmpMerged.length;
				previosClosed += tmpClosed.length;

				mergedData.push({
					x: item,
					y: previosMerged
				});

				closedData.push({
					x: item,
					y: previosClosed
				})
			});

			return {
				labels: this.month,
				data: mergedData,
				closed: closedData
			}

		}

		if (this.state.periodType === 'month') {
			return this.getLabels1(statistic)
		}

		return this.getLabels1(statistic);
	};

	onRepositoryChange = (value:any) => {
		this.setState({
			repository: value
		})
	};

	getLabels = () => {
		const date = new Date(this.state.start_date);
		const month = date.getMonth();
		const year = date.getFullYear();
		let result:any[] = [];

		if (this.state.periodType === 'month') {
			const daysInMonth = new Date(year, month, 0).getDate();
			let i = 1;

			for (i; i <= daysInMonth; i++) {
				result.push(`${i} ${this.month[month]}`);
			}

			return result;
		}

		if (this.state.periodType === 'quorter') {
			const quorter = this.getQuorterByMonth(month);
			const monthInQuorter = this.getMonthInQuorter(quorter + 1);

			monthInQuorter.forEach((item:number) => {
				result.push(`${this.month[item - 1]} ${year}`)
			});

			return result;
		}


		if (this.state.periodType === 'year') {
			let quorter = this.getQuorterByMonth(month);

			for (quorter; quorter < this.quorters.length; quorter++) {
				result.push(`${this.quorters[quorter]} ${year}`)
			}

			return result;
		}

		return [];
	};

	render() {
		return (
			<Card className={this.props.classes.widgetCard}>
				<CardContent>
					<div>
						<div className={this.props.classes.header}>
							<div className={this.props.classes.widgetCardTitle}>Pull Requests</div>
						</div>
						<Divider/>
						<div className={`${this.props.classes.header} ${this.props.classes.secondLine}`}>
							<div className={`${this.props.classes.widgetCardRange} ${this.props.classes.mobileButtonContainer}`}>
								<ButtonsBar
									month
									year
									default={this.state.periodType}
									onActiveChange={this.onPeriodTypeChange}
								/>
							</div>
							<div className={`${this.props.classes.widgetCardRange} ${this.props.classes.mobileSelectsContainer}`}>
								<MultipleSelect
									defaultValue={this.repositories}
									onChange={this.onRepositoryChange}
									optionsList={this.repositories}
									className={`${this.props.classes.repositorySelectWidth} ${this.props.classes.marginRight15}`}
								/>
								{
									!this.state.customRange ? <PeriodSelect
											optionsList={this.state.selectList}
											onChange={this.onActivePeriodChange}
											className={this.props.classes.repositorySelectWidth}
											value={this.state.selectValue}
										/> :
										<div className={this.props.classes.widgetCardAdditional}>
											<MuiPickersUtilsProvider utils={DateFnsUtils}>
												<span>  From  </span>
												<DatePicker
													InputProps={{className: this.props.classes.date}}
													className={this.props.classes.date}
													id="start_date"
													onChange={this.handleStartDateChange}
													value={this.state.start_date}
													format="YYYY/MM/DD"
												/>
												<span>  to  </span>
												<DatePicker
													InputProps={{className: this.props.classes.date}}
													className={this.props.classes.date}
													id="end_date"
													onChange={this.handleEndDateChange}
													value={this.state.end_date}
													format="YYYY/MM/DD"
												/>
											</MuiPickersUtilsProvider>
										</div>
								}
							</div>
						</div>
						<Divider/>
						<div className={this.props.classes.graphWrapper}>
							<Line
							data={{
								labels: _uniq(this.getLabels2().labels),
								datasets: [
									{
										label: 'Closed',
										fill: false,
										lineTension: 0.1,
										backgroundColor: '#ff5700',
										borderColor: '#ff4208',
										borderCapStyle: 'butt',
										borderDash: [],
										borderDashOffset: 0.0,
										borderJoinStyle: 'miter',
										pointBorderColor: 'rgba(75,192,192,1)',
										pointBackgroundColor: '#fff',
										pointBorderWidth: 1,
										pointHoverRadius: 5,
										pointHoverBackgroundColor: '#ff5700',
										pointHoverBorderColor: '#ff4208',
										pointHoverBorderWidth: 2,
										pointRadius: 3,
										pointHitRadius: 10,
										data: this.getLabels2().closed
									},
									{
										label: 'Merged',
										fill: false,
										lineTension: 0.1,
										backgroundColor: '#27a7ff',
										borderColor: '#2c90ff',
										borderCapStyle: 'butt',
										borderDash: [],
										borderDashOffset: 0.0,
										borderJoinStyle: 'miter',
										pointBorderColor: 'rgba(75,192,192,1)',
										pointBackgroundColor: '#fff',
										pointBorderWidth: 1,
										pointHoverRadius: 5,
										pointHoverBackgroundColor: '#27a7ff',
										pointHoverBorderColor: '#2c90ff',
										pointHoverBorderWidth: 2,
										pointRadius: 3,
										pointHitRadius: 10,
										data: this.getLabels2().data
									}
								],
							}}
							options={{
								scales: {
									yAxes: [{
										ticks: {
											beginAtZero: true,
											// @ts-ignore
											precision: 0
										}
									}]
								}
							}}
							width={600}
							height={300}
						/>
						</div>
					</div>
				</CardContent>
			</Card>
		)
	}
}

export default withStyles(styles)(ContritutionGraphWidget);