import * as React from "react";
import {withStyles} from "@material-ui/core/styles";
import CardContent from "@material-ui/core/CardContent/CardContent";
import Card from "@material-ui/core/Card/Card";
import Divider from "@material-ui/core/Divider/Divider";
import PeriodSelect from "./PeriodSelect";
import ButtonsBar from "./ButtonsBar";
import MultipleSelect from './MultipleSelect'
import _filter from 'lodash/filter';
import _includes from 'lodash/includes';
import styles from './ContritutionGraphWidget.style';
import DayService from '../../../service/date/Day';
import YearService from '../../../service/date/Year';
import MonthService from '../../../service/date/Month';
import getFromToRangeDate from '../../../command/date/getFromToRangeDate';
import getFromToRangeData from '../../../command/date/getFromToRangeData';
import getTimestamp from '../../../command/date/getTimestamp';
import Line from '../../graph/Line';

class ContritutionGraphWidget extends React.Component<any, any> {
	private range:any;
	private repository:any;

	private yearService;
	private monthService;
	private dayService;

	constructor(props:any) {
		super(props);

		const { start, end } = getFromToRangeDate(this.props.statistic);
		this.repository = this.getRepository(this.props.statistic);

		this.yearService = new YearService();
		this.monthService = new MonthService();
		this.dayService = new DayService();

		this.range = this.getRange(start, end);
		this.state = this.getState(this.range, this.repository);
	}

	getRepository = collection => collection.map((item:any) => item.repository);

	getState = (range, repository) => {
		const selectValue = this.toSelectValue(range.monthEnd, range.yearEnd);
		const {merged, closed, labels } = this.getMonthData(selectValue, repository);

		return {
			repository,
			selectList: this.getSelectMonthList(range.yearStart, range.yearEnd, range.monthStart, range.monthEnd) || [],
			selectValue: this.toSelectValue(range.monthEnd, range.yearEnd) || '',
			periodType: 'month',
			datasets: [
				{label: 'Closed', colors: {primaryColor: '#ff5700', secondaryColor: '#ff4208'}, data: closed},
				{label: 'Merged', colors: {primaryColor: '#27a7ff', secondaryColor: '#2c90ff'}, data: merged},
			],
			labels,
			start_date: getTimestamp(1, range.monthEnd, range.yearEnd),
			end_date: getTimestamp(this.monthService.getDaysQuantity(range.yearEnd, range.monthEnd), range.monthEnd, range.yearEnd),
	}};

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

	getSelectYearList = (startYear, endYear) =>
		this.yearService.getByRange(startYear, endYear).map(item => ({
			label: item.year,
			value: item.year
		}));

	toSelectValue = (month, year)  => `${month}/01/${year}`;

	getSelectValue = () => `${this.range.month.end + 1}/01/${this.range.years.fullEnd.getFullYear()}`;

	onPeriodTypeChange = (period:string) => {
		if (period === 'month') {
			const value = this.toSelectValue(this.range.monthEnd, this.range.yearEnd);
			const { merged, closed, labels } = this.getMonthData(value, this.state.repository);

			this.setState({
				selectList: this.getSelectMonthList(
					this.range.yearStart,
					this.range.yearEnd,
					this.range.monthStart,
					this.range.monthEnd
				),
			});

			this.setDataToState(value, merged, closed, labels)
		}

		if (period === 'year') {
			const value = this.range.yearEnd;
			const { merged, closed, labels } = this.getYearData(value, this.state.repository);

			this.setState({
				selectList: this.getSelectYearList(this.range.yearStart, this.range.yearEnd),
				selectValue: value
			});

			this.setDataToState(value, merged, closed, labels)
		}

		this.setState({
			periodType: period
		})
	};

	fromSelectValue = value => {
		const date = value.split('/');

		return getTimestamp(date[1], date[0], date[2]);
	};

	getYearData = (value, repository) => this.fillterYearLabelsMergedAndClosed(
		this.sortByDate(
			this.getPullRequests(getFromToRangeData(
				// @ts-ignore
				this.filterRepository(this.props.statistic, repository),
				getTimestamp(1, 0, value),
				getTimestamp(this.monthService.getDaysQuantity(value, 11), 11, value)
			))
		)
	);

	getMonthData = (value, repository) => {
		const timestamp = this.fromSelectValue(value);
		const year = this.yearService.getByTimestamp(timestamp);
		const month = this.monthService.getByTimestamp(timestamp);

		return this.fillterMonthLabelsMergedAndClosed(
			this.sortByDate(
				this.getPullRequests(getFromToRangeData(
					// @ts-ignore
					this.filterRepository(this.props.statistic, repository),
					timestamp,
					getTimestamp(this.monthService.getDaysQuantity(year, month), month, year)
				))
			)
		);
	};

	setDataToState = (value, merged, closed, labels) => this.setState({
		selectValue: value,
		datasets: [
			{label: 'Closed', colors: {primaryColor: '#ff5700', secondaryColor: '#ff4208'}, data: closed},
			{label: 'Merged', colors: {primaryColor: '#27a7ff', secondaryColor: '#2c90ff'}, data: merged},
		],
		labels
	});

	onActivePeriodChange = (event:any) => {
		const { merged, closed, labels } = this.state.periodType === 'month' ?
			this.getMonthData(event.target.value, this.state.repository) :
			this.getYearData(event.target.value, this.state.repository);

		this.setDataToState(event.target.value, merged, closed, labels);
	};

	handleStartDateChange = (date:Date) => this.setState({ start_date: date });

	handleEndDateChange = (date:Date) => this.setState({ end_date: date });

	onRepositoryChange = (value:any) => {
		const { merged, closed, labels } = this.state.periodType === 'month' ?
			this.getMonthData(this.state.selectValue, value) :
			this.getYearData(this.state.selectValue, value);

		this.setDataToState(this.state.selectValue, merged, closed, labels);
		this.setState({ repository: value });
	};

	sortByDate = (collection:any) => collection.sort((first:any, second:any) =>
		new Date(first.closed_at).getTime() - new Date(second.closed_at).getTime());

	fillterYearLabelsMergedAndClosed = (collection:any) => {
		let merged = {};
		let closed = {};
		let labels = this.monthService.getList();

		collection.forEach(item => {
			let month = this.monthService.getNameByIndex(new Date(item.closed_at).getUTCMonth());

			if (item.merged) {
				merged[month] = merged[month] ? merged[month] + 1 : 1;
			} else {
				closed[month] = closed[month] ? closed[month] + 1 : 1;
			}
		});

		return {merged: this.increaseEachNextMonth(merged), closed: this.increaseEachNextMonth(closed), labels}
	};

	increaseEachNextMonth = object => {
		let tmp = 0;

		Object.keys(object).forEach(month => {
			object[month] += tmp;
			tmp = object[month]
		});

		return object;
	};

	fillterMonthLabelsMergedAndClosed = (collection:any) => {
		let mergedQuantity = 0,
			closedQuantity = 0,
			merged = {},
			closed = {},
			labels = {};

		collection.forEach((item:any) => {
			const timestamp = new Date(item.closed_at).getTime();
			const month = this.monthService.getNameByIndex(this.monthService.getByTimestamp(timestamp));
			const day = this.dayService.getByTimestamp(timestamp);

			if (item.merged) {
				mergedQuantity++;
				merged[`${day} ${month}`] = mergedQuantity;
			} else {
				closedQuantity++;
				closed[`${day} ${month}`] = closedQuantity;
			}

			if (!labels[`${day} ${month}`]) {
				labels[`${day} ${month}`] = true;
			}
		});

		return { merged, closed, labels: Object.keys(labels) }
	};

	getPullRequests = (collection:any) => {
		let items:any = [];

		collection.forEach((item:any) => items = [...items, ...item.merged, ...item.closed]);

		return items;
	};

	filterRepository = (collection, repository) => _filter(collection, (val:any) => _includes(repository, val.repository));

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
									defaultValue={this.state.repository}
									onChange={this.onRepositoryChange}
									optionsList={this.repository}
									className={`${this.props.classes.repositorySelectWidth} ${this.props.classes.marginRight15}`}
								/>
								<PeriodSelect
									optionsList={this.state.selectList}
									onChange={this.onActivePeriodChange}
									className={this.props.classes.repositorySelectWidth}
									value={this.state.selectValue}
								/>
							</div>
						</div>
						<Divider/>
						<div className={this.props.classes.graphWrapper}>
							<Line
								datasets={this.state.datasets}
								labels={this.state.labels}
							/>
						</div>
					</div>
				</CardContent>
			</Card>
		)
	}
}

export default withStyles(styles)(ContritutionGraphWidget);