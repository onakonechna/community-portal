import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import * as React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import { withRouter } from 'react-router-dom';

export const styles = {
  contributorAvatar: {
    'margin-right': '3px'
  }
};

class ContributorsList extends React.Component<any, any> {
  toProfile(user_id:string, e: any) {
    e.stopPropagation();
    this.props.history.push(`/profile/${user_id}`);
  }

  countContributors(project: any) {
    switch (project.contributors_quantity) {
      case 0:
        return '0 Contributors';
      default:
        return `${project.contributors_quantity} Contributors`;
    }
  }

  render() {
    return (
        <div>
          <Typography className={this.props.topContributorTextClass}>
            Top Contributors
          </Typography>
          <div className={this.props.contributorsListClass}>
            {
              this.props.project.contributors.length > 0 &&
              this.props.project.contributors.slice(0, this.props.numberOfContributors).map((user:any) => (
                  <Avatar
                      onClick={(e) => this.toProfile(user.login, e)}
                      key={user.id}
                      src={user.avatar_url}
                      className={this.props.classes.contributorAvatar}
                  />
              ))
            }
          </div>
          <Typography className={this.props.contributorTextClass}>
            {this.countContributors(this.props.project)}
          </Typography>
        </div>
    )
  }
}

export default withRouter<any>(withStyles(styles)(ContributorsList));
