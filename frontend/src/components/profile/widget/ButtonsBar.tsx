import Button from "@material-ui/core/Button/Button";
import * as React from "react";
import {withStyles} from "@material-ui/core/styles";

const styles = (theme:any) => ({
	buttonsBar: {
		'border-radius': '4px',
		'border': '1px solid #ccc',
		'& button': {
			'border-right': '1px solid #ccc',
			'border-radius': '0',
			'color': '#6b6868',
			'font-weight': '500',
			'font-size': '11px'
		},
		'& button:last-child': {
			'border-right': '0'
		}
	},
	active: {
		'background': '#ff5700 !important',
		'color': '#fff !important'
	}
});


class ButtonsBar extends React.Component<any, any> {
	constructor(props:any) {
		super(props);

		this.state = {
			active: props.default || 'month'
		}
	}

	setActive = (type:string) => () => {
		if (this.props.onActiveChange) {
			this.props.onActiveChange(type)
		}

		this.setState({
			active: type
		})
	};

	render() {
		return (
			<div className={this.props.classes.buttonsBar}>
				{this.props.month && <Button onClick={this.setActive('month')} className={this.state.active === 'month' ? this.props.classes.active : ''} size="small">Month</Button>}
				{this.props.quorter && <Button onClick={this.setActive('quorter')} className={this.state.active === 'quorter' ? this.props.classes.active : ''} size="small">Quorter</Button>}
				{this.props.year && <Button onClick={this.setActive('year')} className={this.state.active === 'year' ? this.props.classes.active : ''} size="small">Year</Button>}
				{this.props.custom && <Button onClick={this.setActive('custom')} className={this.state.active === 'custom' ? this.props.classes.active : ''} size="small">Custom</Button>}
			</div>
		)
	}
}

export default withStyles(styles)(ButtonsBar);