import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import * as React from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import { withRouter } from 'react-router-dom';

export const styles = {
  contributorText: {
    'font-size': '1rem',
    'font-weight': '300',
    'margin-left': '1rem',
    'margin-top': 'auto',
  },
};

class ContributorsList extends React.Component<any, any> {
  toProfile(user_id:string, e: any) {
    e.stopPropagation();
    this.props.history.push(`/profile/${user_id}`);
  }

  countContributors(project: any) {
    const contributorsQuantity = Object.keys(project.contributors).length;

    switch (contributorsQuantity) {
      case 0:
        return '0 Contributors';
      case 1:
        return '1 Contributor';
      default:
        return `${contributorsQuantity} Contributors`;
    }
  }

  render() {
    return (
      <div className={this.props.contributorsListClass}>
        {
          this.props.project.contributors.length > 0 &&
            this.props.project.contributors.slice(0, 5).map((user:any) => {debugger; return(
              <Avatar
                onClick={(e) => this.toProfile(user.id, e)}
                key={user.id}
                src={user.avatar_url} />
            )})
        }
        <Typography className={this.props.classes.contributorText}>{this.countContributors(this.props.project)}</Typography>
      </div>
    )
  }
}

export default withRouter<any>(withStyles(styles)(ContributorsList));
