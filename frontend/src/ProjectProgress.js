import React from 'react';
import { LinearProgress } from 'material-ui/Progress';

import Typography from 'material-ui/Typography';

const styles = {
    progressline: {
      margin: 20,
    },
}

export default class ProjectProgress extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      estimated: props.estimated,
      pledged: props.pledged,
      completed: props.pledged * 100 / props.estimated,
    };
  }

//   componentDidMount() {
//     this.timer = setTimeout(() => this.progress(5), 1000);
//   }

//   componentWillUnmount() {
//     clearTimeout(this.timer);
//   }

  progress(completed) {
    if (completed > 100) {
      this.setState({completed: 100});
    } else {
      this.setState({completed});
      const diff = Math.random() * 10;
      //this.timer = setTimeout(() => this.progress(completed + diff), 1000);
    }
  }

  render() {
    return (
        <div>
        <Typography type="caption">
        Open for: 120 days
        </Typography>
        <Typography type="caption">
        Due Date: March 5
        </Typography>
        <Typography type="caption">
        Currently contributors: 99
        </Typography>
        <Typography type="caption">
        Goal: {this.state.estimated} hours
        </Typography>
        <Typography type="caption">
        Pledged: {this.state.pledged} hours
        </Typography>
        <Typography component="p">
      <LinearProgress className={styles.progressline} mode="determinate" value={this.state.completed} />
      </Typography>
      </div>
    );
  }
}