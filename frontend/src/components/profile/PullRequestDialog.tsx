import DialogTitle from "@material-ui/core/DialogTitle/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent/DialogContent";
import DialogActions from "@material-ui/core/DialogActions/DialogActions";
import Button from "@material-ui/core/Button/Button";
import Dialog from "@material-ui/core/Dialog/Dialog";
import * as React from "react";
import withStyles from "@material-ui/core/styles/withStyles";


const styles = theme => ({
	cell: {
		display: 'table-cell',
		'border-top': '1px solid lightgray'
	},
	detailsCell: {
		padding: '10px',
		'font-size': '13px',
		'border-top': '1px solid lightgray'
	},
	detailsCellHeader: {
		color: '#000'
	},
	dialog: {
		'font-family': 'system-ui'
	},
	table: {
		display: 'table',
		width: '100%'
	},
	row: {
		display: 'table-row',
	},
});

const PullRequestDialog = (props:any) => (
	<Dialog
		open={props.open}
		onClose={props.onClose}
		scroll={'paper'}
		className={props.classes.dialog}
		aria-labelledby="scroll-dialog-title"
	>
		<DialogTitle id="scroll-dialog-title">Pull Requests:</DialogTitle>
		<DialogContent>
				<div className={props.classes.table}>
					<div className={props.classes.row}>
						<div className={`${props.classes.cell} ${props.classes.detailsCell} ${props.classes.detailsCellHeader}`}>Pull Request:</div>
						<div className={`${props.classes.cell} ${props.classes.detailsCell} ${props.classes.detailsCellHeader}`}>Achievements:</div>
						<div className={`${props.classes.cell} ${props.classes.detailsCell} ${props.classes.detailsCellHeader}`}>Points:</div>
						<div className={`${props.classes.cell} ${props.classes.detailsCell} ${props.classes.detailsCellHeader}`}>Created:</div>
						<div className={`${props.classes.cell} ${props.classes.detailsCell} ${props.classes.detailsCellHeader}`}>Merged:</div>
					</div>
					{props.data.merged.map((pr:any) =>
						<div className={`${props.classes.row}`} key={`${pr.full}/${pr.pr_number}`}>
							<div className={`${props.classes.cell} ${props.classes.detailsCell}`}><a target={'_blank'} href={`https://github.com/${pr.full}/pull/${pr.pr_number}`}>{`${pr.full}/${pr.pr_number}`}</a></div>
							<div className={`${props.classes.cell} ${props.classes.detailsCell}`}>{pr.achievements}</div>
							<div className={`${props.classes.cell} ${props.classes.detailsCell}`}>{pr.points}</div>
							<div className={`${props.classes.cell} ${props.classes.detailsCell}`}>{new Date(pr.created_at).toLocaleDateString()}</div>
							<div className={`${props.classes.cell} ${props.classes.detailsCell}`}>{new Date(pr.closed_at).toLocaleDateString()}</div>
						</div>)}
				</div>
		</DialogContent>
		<DialogActions>
			<Button onClick={props.onClose} color="primary">
				Close
			</Button>
		</DialogActions>
	</Dialog>
);

export default withStyles(styles)(PullRequestDialog);
