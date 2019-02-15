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
import YearService from '../../../service/date/Year';
import MonthService from '../../../service/date/Month';
import QuarterService from '../../../service/date/Quarter';
import getFromToRangeDate from '../../../command/date/getFromToRangeDate';
import getFromToRangeData from '../../../command/date/getFromToRangeData';
import getTimestamp from '../../../command/date/getTimestamp';
import styles from './ContributionPoints.style';

class ContributionPoints extends React.Component<any, any> {
	private range:any;
	private yearService;
	private quarterService;
	private monthService;

	constructor(props: any) {
		super(props);

		const { start, end } = getFromToRangeDate(this.props.statistic);

		this.yearService = new YearService();
		this.quarterService = new QuarterService();
		this.monthService = new MonthService();


		this.range = this.getRange(start, end);
		this.state = this.getState(this.range);
	}

	getState = range => ({
		selectList: this.getSelectMonthList(range.yearStart, range.yearEnd, range.monthStart, range.monthEnd) || [],
		selectValue: this.toSelectValue(range.monthEnd, range.yearEnd) || '',
		customRange: false,
		periodType: 'month',
		start_date: getTimestamp(1, range.monthEnd, range.yearEnd),
		end_date: getTimestamp(this.monthService.getDaysQuantity(range.yearEnd, range.monthEnd), range.monthEnd, range.yearEnd)
	});

	getRange = (start, end) => ({
		yearStart: this.yearService.getByTimestamp(start),
		monthStart: this.monthService.getByTimestamp(start),
		yearEnd: this.yearService.getByTimestamp(end),
		monthEnd: this.monthService.getByTimestamp(end)
	});

	getSelectMonthList = (startYear, endYear, startMonth, endMonth) =>
		this.monthService.getByRange(startYear, endYear, startMonth, endMonth).map(item => ({
			label: `${item.name} ${item.year}`,
			value: `${item.month}/01/${item.year}`
		}));

	getSelectQuarterList = (startYear, endYear, startMonth, endMonth) =>
		this.quarterService.getByRange(startYear, endYear, startMonth, endMonth).map(item => ({
			label: `${item.name} ${item.year}`,
			value: `${item.quarter}/${item.year}`
		}));

	getSelectYearList = (startYear, endYear) =>
		this.yearService.getByRange(startYear, endYear).map(item => ({
			label: item.year,
			value: item.year
		}));

	handleStartDateChange = (date:Date) => this.setState({start_date: this.getUtcAsLocal(date)});
	handleEndDateChange = (date:Date) => this.setState({end_date: this.getUtcAsLocal(date)});
	handleClickOpen = (repositori:string) => this.setState({ [repositori]: true });
	handleClose = (repositori:string) => this.setState({ [repositori]: false });
	getPoints = (collection:any[]) => collection.reduce((result, value) => result + value.points, 0);
	getUtcAsLocal = date => date.getTime() - (date.getTimezoneOffset() * 60000);

	onPeriodTypeChange = (period:string) => {
		if (period === 'month') {
			const value = this.toSelectValue(this.range.monthEnd, this.range.yearEnd);

			this.setState({
				customRange: false,
				selectList: this.getSelectMonthList(
					this.range.yearStart,
					this.range.yearEnd,
					this.range.monthStart,
					this.range.monthEnd
				),
			});

			this.onActiveMonthPeriodChange(value);
		}

		if (period === 'quorter') {
			const value = `${this.quarterService.getIndexByMonth(this.range.monthEnd)}/${this.range.yearEnd}`;

			this.setState({
				customRange: false,
				selectList: this.getSelectQuarterList(
					this.range.yearStart,
					this.range.yearEnd,
					this.range.monthStart,
					this.range.monthEnd
				),
				selectValue: value
			});

			this.onActiveQuorterPeriodChange(value);
		}

		if (period === 'year') {
			const value = this.range.yearEnd;

			this.setState({
				customRange: false,
				selectList: this.getSelectYearList(this.range.yearStart, this.range.yearEnd),
				selectValue: value
			});

			this.onActiveYearPeriodChange(value)
		}

		if (period === 'custom') {
			this.setState({
				customRange: true,
				start_date:  getTimestamp(1, this.range.monthStart, this.range.yearStart),
				end_date: getTimestamp(
					this.monthService.getDaysQuantity(this.range.monthEnd, this.range.yearEnd),
					this.range.monthEnd,
					this.range.yearEnd
				)
			})
		}
		
		this.setState({
			periodType: period
		})
	};

	onActiveMonthPeriodChange = (value:any) => {
		const timestamp = this.fromSelectValue(value);
		const year = this.yearService.getByTimestamp(timestamp);
		const month = this.monthService.getByTimestamp(timestamp);

		this.setState({
			start_date: timestamp,
			end_date: getTimestamp(this.monthService.getDaysQuantity(year, month), month, year),
			selectValue: value
		});
	};

	onActiveQuorterPeriodChange = (value:string) => {
		const quorter = value.split('/')[0];
		const year = value.split('/')[1];
		const startMonth = this.quarterService.getFirstMonthIndex(quorter);
		const endMonth = this.quarterService.getLastMonthIndex(quorter);

		this.setPeriodChangeState(value, 1, startMonth, endMonth, year);
	};

	onActiveYearPeriodChange = (value:string) => 	this.setPeriodChangeState(value, 1, 0, 11, value);

	setPeriodChangeState = (value,day, startMonth, endMonth, year) => this.setState({
		start_date: getTimestamp(day, startMonth, year),
		end_date: getTimestamp(this.monthService.getDaysQuantity(year, endMonth), endMonth, year),
		selectValue: value
	});

	fromSelectValue = value => {
		const date = value.split('/');

		return getTimestamp(date[1], date[0], date[2]);
	};

	toSelectValue = (month, year)  => `${month}/01/${year}`;

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

		render() {
			return (
				<Card className={this.props.classes.widgetCard}>
					<CardContent>
						<div>
							<div className={this.props.classes.header}>
								<div className={this.props.classes.widgetCardTitle}>Contributor Points</div>
								<div className={this.props.classes.widgetCardRange}>
									<div
										className={this.props.classes.redBox}>{this.getPoints(getFromToRangeData(this.props.statistic, this.state.start_date, this.state.end_date))} pts.</div>
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
								{this.state.start_date && this.state.end_date && getFromToRangeData(this.props.statistic, this.state.start_date, this.state.end_date)
									.map((item: any) => item.points ? (
										<div className={this.props.classes.widgetRepositoryItem} key={item.repository}>
											<div className={this.props.classes.blueBox}>{item.points} pts.</div>
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

