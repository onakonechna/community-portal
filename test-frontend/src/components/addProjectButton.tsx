import * as React from 'react';

import { withStyles } from '@material-ui/core/styles';

import Button from '@material-ui/core/Button';
import Add from '@material-ui/icons/Add';

interface IProps {
	classes: any,
	onClick: () => void
}

const styles = {
	button: {
		margin: 'auto, 20px, auto, 20px'
	},
};

function AddProjectButton(props: IProps) {
	const { classes } = props;
	return (
		<div>
			<Button
				color='primary'
				aria-label='add'
				onClick={props.onClick}
				className={classes.button}>
				<Add />
			</Button>
		</div>
	)
}

export default withStyles(styles)(AddProjectButton);