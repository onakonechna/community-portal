import * as React from 'react';
import { connect } from 'react-redux';
import compose from 'recompose/compose';

import { withStyles } from '@material-ui/core/styles';

// import { Dialog, DialogActions, DialogContent, DialogTitle } from '@material-ui/core';
// import { FormControl, FormControlLabel, FormLabel } from '@material-ui/core';
// import Button from '@material-ui/core/Button';
// import Chip from '@material-ui/core/Chip';
// import CircularProgress from '@material-ui/core/CircularProgress';

// import Radio from '@material-ui/core/Radio';
// import RadioGroup from '@material-ui/core/RadioGroup';
// import TextField from '@material-ui/core/TextField';

const styles = (theme: any) => ({
	chip: {
		'margin': '5px 5px'
	},
	textField: {
		width: 200,
	}
});

interface EditDialogProps {
	classes?: any
}

interface EditDialogState {
	open: boolean,
	success: boolean,
	loading: boolean,
	technologies: Technology[],
	technologiesString: string,
	size: string,
	name: string,
	description: string,
	due: string,
	goal: number,
	github: string,
	slack: string,
	[key: string]: boolean | string | number | Technology[]
}

interface Technology {
	key?: number,
	type: string
}

export class EditProjectDialog extends React.Component<EditDialogProps, EditDialogState> {
    constructor(props: EditDialogProps) {
        super(props);

    }

    render(){
        return(
					<div>sth</div>
				)
    }
}

const mapStateToProps = (state: any) => {
	return {

	}
}

const mapDispatchToProps = (dispatch: any) => {
	return {

	}
}

export default compose<{}, EditDialogProps>(
	withStyles(styles, {
		name: 'EditProjectDialog'
	}),
	connect<{}, {}, EditDialogProps>(mapStateToProps, mapDispatchToProps)
)(EditProjectDialog);

