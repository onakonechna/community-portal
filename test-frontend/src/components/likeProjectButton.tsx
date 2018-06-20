import * as React from 'react';

import { withStyles } from '@material-ui/core/styles';

import Button from '@material-ui/core/Button';
import Favorite from '@material-ui/icons/Favorite';
import IconButton from '@material-ui/core/IconButton';

interface IProps {
	classes: any,
  project_id: string,
}

// const styles = {
// 	button: {
// 		margin: 'auto, 20px, auto, 20px'
// 	},
// };

export default class likeProjectButton extends React.Component<IProps, {}> {
  constructor(props: IProps) {
    super(props);
    this.likeProject = this.likeProject.bind(this);
  }

  likeProject() {
    const { project_id } = this.props;
  }

  render() {
  	const { classes } = props;
  	return (
  		<div>
  			<IconButton
  				aria-label='like'
  				onClick={this.likeProject}
  				className={classes.button}>
  				<Favorite />
  			</IconButton>
  		</div>
    )
  }
}

export default withStyles(styles)(AddProjectButton);
