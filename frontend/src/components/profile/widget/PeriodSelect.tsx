import * as React from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import Select from "@material-ui/core/Select/Select";
import InputLabel from "@material-ui/core/InputLabel";
import { v4 as uuid } from 'uuid';

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
	}
});

const id = uuid();
const PeriodSelect = (props:any) => (
	<div>
		{
			props.selectLabel && <InputLabel shrink htmlFor={id}>
				{props.selectLabel}
			</InputLabel>
		}
		<Select
			native
			id={id}
			value={props.value}
			inputProps={{className: props.classes.selectInput}}
			className={`${props.classes.select} ${props.className || ''}`}
			onChange={props.onChange}
		>
			{props.optionsList.map((item:any) => (
				<option key={item.value} value={item.value}>{item.label}</option>
			))}
		</Select>
	</div>
);

export default withStyles(styles)(PeriodSelect);