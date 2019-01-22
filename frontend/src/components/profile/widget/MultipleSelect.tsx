import * as React from "react";
import { withStyles } from '@material-ui/core/styles';
import Input from '@material-ui/core/Input';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemText from '@material-ui/core/ListItemText';
import Select from '@material-ui/core/Select';
import Checkbox from '@material-ui/core/Checkbox';
import { v4 as uuid } from 'uuid';
import _isEqual from 'lodash/isEqual';
import _includes from 'lodash/includes';
import _filter from 'lodash/filter';


const styles = (theme:any) => ({
	select: {
		'min-width': '260px',
		'color': '#6b6868',
		'text-transform': 'uppercase',
		'font-size': '11px',
		'font-weight': '500',
		'line-height': '18px',
		'height': '30px',
		'font-family': 'system-ui'
	},
	selectInput: {
		'text-transform': 'uppercase'
	},
	selected: {
		background: 'rgba(0, 0, 0, 0.14) !important'
	}
});

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
	PaperProps: {
		style: {
			maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
			width: 250,
		},
	},
};

class MultipleSelect extends React.Component<any, any> {
	private id:any;

	constructor(props:any) {
		super(props);


		this.id = uuid();
		this.state = {
			name: props.defaultValue || [],
			selectAll: false
		};
	}

	componentWillReceiveProps(props:any) {
		if (!this.props.defaultValue.length && props.defaultValue.length) {
			if (_isEqual(props.defaultValue, props.optionsList)) {
				this.setState({
					name: props.defaultValue,
					selectAll: true
				})
			} else {
				this.setState({
					name: props.defaultValue
				})
			}
		}
	}


	private removePlaceholder = (value:string[]) =>
		_filter(value, (item:string) => item !== 'Select repositories');

	handleChange = (event:any) => {
		const includes = _includes(event.target.value, 'all');
		const value:any = {};

		if (includes && this.state.selectAll) {
			value.name = ['Select repositories'];
			value.selectAll = false;
		} else if (includes && !this.state.selectAll) {
			value.name = this.props.optionsList;
			value.selectAll = true;
		} else if (this.state.selectAll) {
			value.name = this.removePlaceholder(event.target.value);
			value.selectAll = false;
		} else {
			value.name = this.removePlaceholder(event.target.value);
		}

		this.setState(value);
		this.props.onChange && this.props.onChange(value.name);
	};

	renderValue = (selected:any[]) => {
		if (selected.length > 1) {
			return `Repositories: ${selected.length} Selected`
		}

		return selected[0];
	};

	render() {
		return (
			<div>
					<Select
						multiple
						value={this.state.name}
						className={`${this.props.classes.select} ${this.props.className || ''}`}
						onChange={this.handleChange}
						inputProps={{className: this.props.classes.selectInput, placeholder: 'R22'}}
						input={<Input id={this.id} />}
						renderValue={this.renderValue}
						MenuProps={MenuProps}
					>
						{[
							<MenuItem key={'all'} className={this.state.selectAll ? this.props.classes.selected : ''} value={'all'}>
								<Checkbox checked={this.state.selectAll} />
								<ListItemText primary={'Select All'} />
							</MenuItem>,
							...this.props.optionsList.map((name:any) => (
							<MenuItem key={name} value={name}>
								<Checkbox checked={this.state.name.indexOf(name) > -1} />
								<ListItemText primary={name} />
							</MenuItem>
						))]}
					</Select>
			</div>
		);
	}
}


export default withStyles(styles)(MultipleSelect);