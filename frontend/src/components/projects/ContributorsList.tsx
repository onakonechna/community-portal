import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import * as React from "react";
import withStyles from "@material-ui/core/styles/withStyles";

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
    this.props.history.push(`./profile/${user_id}`);
  }

  countContributors(project: any) {
    const contributorsQuantity = Object.keys(project.contributors).length;

    switch (contributorsQuantity) {
      case 0:
        return 'Nobody joined yet';
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
          Object.keys(this.props.project.contributors).length > 0 &&
            Object.keys(this.props.project.contributors).slice(0, 5).map(userId => (
              <Avatar
                onClick={(e) => this.toProfile(userId, e)}
                key={userId}
                src={this.props.project.contributors[userId].avatar_url} />
            ))
        }
        <Typography className={this.props.classes.contributorText}>{this.countContributors(this.props.project)}</Typography>
      </div>
    )
  }
}

export default withStyles(styles)(ContributorsList);
