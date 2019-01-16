import * as React from 'react';
import {connect} from 'react-redux';
import {withStyles} from "@material-ui/core/styles";
import compose from "recompose/compose";
import CardContent from "@material-ui/core/CardContent/CardContent";
import Card from "@material-ui/core/Card/Card";
import Divider from "@material-ui/core/Divider";
import MuiPickersUtilsProvider from "material-ui-pickers/utils/MuiPickersUtilsProvider";
import DatePicker from 'material-ui-pickers/DatePicker';
import DateFnsUtils from 'material-ui-pickers/utils/date-fns-utils';
import PullRequestDialog from '../PullRequestDialog';
import ButtonsBar from './ButtonsBar';
import PeriodSelect from './PeriodSelect';

const styles = (theme:any) => ({
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
		'font-weight': 'bold'
	},
	widgetCardPeriod: {
		'font-size': '14px',
		'display': 'inline-block',
		'color': '#6b6868',
		'font-family': 'system-ui',
	},
	widgetCardRange: {
		display: 'flex',
	},
	rangeContainer: {
		'width': '280px',
		['@media (max-width: 686px)']: {
			'width': '266px'
		},
		['@media (max-width: 661px)']: {
			'margin-top': '10px',
			'width': '100%',
			'& > div': {
				'width': '100%',
				'& > div': {
					'width': '100%'
				}
			}
		}

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
	buttonsContainer: {
			'min-width': '266px',
			['@media (max-width: 661px)']: {
				'justify-content': 'center',
				'min-width': '100%',
				'& > div': {
					'width': '100%',
					'& > button': {
						'width': '25%'
					}
				}
			}
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
		'padding-bottom': '0',
		['@media (max-width: 661px)']: {
			'justify-content': 'center'
		}
	},
});

class ContributionPoints extends React.Component<any, any> {
	private cache:any;
	private quorters:string[];
	private month:string[];
	private range:any;

	constructor(props: any) {
		super(props);

		this.cache = {};
		this.state = {};
		this.quorters = ['Q1', 'Q2', 'Q3', 'Q4'];
		this.month = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

		this.state = {
			selectList: [],
			selectValue: '',
			customRange: false,
			periodType: 'month'
		}
	}

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

	componentWillReceiveProps(props:any) {
		if (!this.props.statistic.length && props.statistic.length) {
			this.range = this.getPeriodRange(props.statistic);

			this.onPeriodTypeChange(this.state.periodType);
		}
	}

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

	handleClickOpen = (repositori:string) => {
		this.setState({ [repositori]: true });
	};

	handleClose = (repositori:string) => {
		this.setState({ [repositori]: false });
	};

	getPoints = (collection:any[]) => {
		let points = 0;

		collection.forEach((item:any) => {
			points += item.points;
		});

		return points;
	};

	filterPeriod = (start:number, end:number) => {
		if (!this.cache[start.toString() + end.toString()]) {
			this.cache[start.toString() + end.toString()] = this.props.statistic.map((item: any) => {
				const data: any = {};

				data.merged = item.merged.filter((el: any) => new Date(el.closed_at).getTime() >= start && new Date(el.closed_at).getTime() <= end);
				data.points = 0;
				data.merged.forEach((el: any) => data.points += el.points);
				data.repository = item.repository;

				return data;
			});
		}

		return this.cache[start.toString() + end.toString()];
	};

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

		render() {
			return (
				<Card className={this.props.classes.widgetCard}>
					<CardContent>
						<div>
							<div className={this.props.classes.header}>
								<div className={this.props.classes.widgetCardTitle}>Contributor Points</div>
								<div className={this.props.classes.widgetCardRange}>
									<div
										className={this.props.classes.redBox}>{this.getPoints(this.filterPeriod(new Date(this.state.start_date).getTime(), new Date(this.state.end_date).getTime()))}</div>
								</div>
							</div>
							<Divider/>
							<div className={`${this.props.classes.header} ${this.props.classes.secondLine}`}>
								<div className={`${this.props.classes.buttonsContainer} ${this.props.classes.widgetCardRange}`}>
									<ButtonsBar
										custom
										month
										year
										quorter
										default={this.state.periodType}
										onActiveChange={this.onPeriodTypeChange}
									/>
								</div>
								<div className={`${this.props.classes.rangeContainer} ${this.props.classes.widgetCardRange}`}>
									{
										!this.state.customRange ? <PeriodSelect
												optionsList={this.state.selectList}
												onChange={this.onActivePeriodChange}
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
							<div className={this.props.classes.widgetRepositoryContainer}>
								{this.state.start_date && this.state.end_date && this.filterPeriod(new Date(this.state.start_date).getTime(), new Date(this.state.end_date).getTime())
									.map((item: any) => item.points ? (
										<div className={this.props.classes.widgetRepositoryItem} key={item.repository}>
											<div className={this.props.classes.blueBox}>{item.points}</div>
											<div className={`${this.props.classes.inlineBlock} ${this.props.classes.underline}`}
													 onClick={this.handleClickOpen.bind(this, item.repository)}>{item.repository}</div>
											<PullRequestDialog
												open={!!this.state[item.repository]}
												onClose={this.handleClose.bind(this, item.repository)}
												data={item}
											/>
										</div>
									) : null)}
							</div>
						</div>
					</CardContent>
				</Card>
			)
		}
}

const mapStateToProps = (state:any) => ({});

export default compose<{}, any>(
	withStyles(styles, {
		name: 'ContributionPoints',
	}),
	connect(
		mapStateToProps, {},
	),
)(ContributionPoints);

