import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';
import * as React from "react";
import withStyles from "@material-ui/core/styles/withStyles";

export const styles = (theme: any) => ({
  progress: {
    color: '#48BF61',
    'z-index': '1',
    position: 'absolute' as 'absolute',
  },
  progressText: {
    position: 'absolute' as 'absolute',
    margin: 'auto',
    width: '80%',
    left: '0',
    right: '0',
    top: '0',
    bottom: '0',
    height: '40%',
    'text-align': 'center',
    'font-weight': '400',
    'font-size': '1rem',
  },
  hourText: {
    'display': 'block',
    'font-size': '1rem',
  },
  estimatedText: {
    'font-weight': '200',
  },
});

class Progress extends React.Component<any, any> {
  getPercentage(project: any) {
    const numOfPledgers = Object.keys(project.contributors).length;
    const { estimated } = this.props.project;
    return Math.min(100, (numOfPledgers / estimated) * 100);
  }

  render() {
    return (
      <div className={this.props.progressClass}>
        <CircularProgress
          className={this.props.classes.progress}
          variant="static"
          size={100}
          value={this.getPercentage(this.props.project)}
        />
        <CircularProgress
          variant="static"
          style={{ color: '#E0E0E0' }}
          size={100}
          value={100}
        />
        <Typography className={this.props.classes.progressText}>
          {`${Object.keys(this.props.project.contributors).length}`}
          { this.props.project.estimated &&
            this.props.project.estimated > 0 ?
            <label className={this.props.classes.estimatedText}>{`/${this.props.project.estimated}`}</label> : null
          }
          <span className={this.props.classes.hourText}>{`joined`}</span>
        </Typography>
      </div>
    )
  }
}

export default withStyles(styles)(Progress);
