import * as React from 'react';
import { connect } from 'react-redux';
import compose from 'recompose/compose';

import UserAvatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import { withStyles, Theme } from '@material-ui/core/styles';
import { Classes } from '../../node_modules/@types/jss';

import LineChart from './visualizations/LineChart';
import PieChart from './visualizations/PieChart';
import ProfileText from './visualizations/ProfileText';

const styles = (theme: Theme) => ({
  avatar: {
    height: '10rem',
    width: '10rem',
  },
  bio: {
    'margin-right': '2rem',
  },
  card: {
    'background-color': '#F2F3F3',
  },
  content: {
    display: 'flex',
    'margin-left': '3rem',
    'margin-top': '3rem',
  },
  defaultText: {
    'font-family': 'system-ui',
    'font-size': '3rem',
    [theme.breakpoints.down('md')]: {
      'font-size': '2rem',
      'margin-left': '1rem',
    },
    [theme.breakpoints.down('sm')]: {
      'font-size': '1rem',
    },
    'font-weight': '300',
    'margin-left': '20%',
  },
  mid: {
    display: 'flex',
    'flex-direction': 'column',
  },
  nameText: {
    'margin-top': '1rem',
    'font-size': '2rem',
    'font-family': 'system-ui',
    'font-weight': '600',
  },
  companyText: {
    'font-size': '1.5rem',
  },
  editButton: {
    'margin-left': '1rem',
    display: 'none',
  },
  leftPanel: {
    display: 'flex',
    'flex-direction': 'column',
  },
  midPanel: {
    'margin-left': '10rem',
  },
  rightPanel: {
    'margin-left': 'auto',
    'margin-right': '15rem',
  },
});

interface ProfileProps {
  classes: Classes;
}

interface ProfileState {
  editUserOpen: boolean;
}

interface ProfileMapProps {
  user: {
    user_id: string,
    avatar_url: string,
    contribution: any,
    name: string,
    role: string,
    likedProjects: string[],
    company: string,
    scopes: string[],
  };
}

interface ProfileDispatchProps {

}

class Profile extends React.Component<ProfileProps & ProfileMapProps & ProfileDispatchProps, ProfileState> {
  constructor(props: ProfileProps & ProfileMapProps & ProfileDispatchProps) {
    super(props);
    this.state = {
      editUserOpen: false,
    };
    this.toggleEditUser = this.toggleEditUser.bind(this);
  }

  toggleEditUser() {
    this.setState((prevState: ProfileState) => ({
      editUserOpen: !prevState.editUserOpen,
    }));
  }

  render() {
    const { user, classes } = this.props;
    const data = user.contribution;

    const total = data.length;
    const merged = data.filter((d:any) => d.merged).length;
    const open = total - merged;

    return (
      <div className={classes.content}>
        <div className={classes.mid}>
          <div className={classes.leftPanel}>
            <div className={classes.bio}>
              <UserAvatar className={classes.avatar} src={this.props.user.avatar_url} />
              <Typography className={classes.nameText}>
                {user.name}
              </Typography>
              <Typography className={classes.companyText}>
                {user.company}
              </Typography>
            </div>
            <ProfileText totalPR={total} mergedPR={merged} openPR={open} />
          </div>
        </div>
        {total > 0 && <div className={classes.midPanel}>
          <LineChart data={data} width={700} height={300} />
        </div>}
        {total > 0 && <div className={classes.rightPanel}>
          <PieChart
            data={data}
            width={400}
            height={400}
          />
        </div>}
        {total <= 0 && <Typography className={classes.defaultText}>
          This user doesn't have any contribution data yet
          </Typography>}
      </div>
    );
  }
}

const mapStateToProps = (state: any) => {
  return {
    projects: state.project,
    user: state.user,
  };
};

const mapDispatchToProps = (dispatch: any) => {

};

export default compose<{}, ProfileProps>(
  withStyles(styles, {
    name: 'Profile',
  }),
  connect<ProfileMapProps, ProfileDispatchProps, ProfileProps>(mapStateToProps, mapDispatchToProps),
)(Profile);
