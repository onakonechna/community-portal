import * as React from 'react';
import { connect } from 'react-redux';
import compose from 'recompose/compose';

import UserAvatar from '@material-ui/core/Avatar';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
//import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import { withStyles, Theme } from '@material-ui/core/styles';
import ParnersProfile from './partners/pages/Profile';
//import Edit from '@material-ui/icons/Edit';
import { Classes } from '../../node_modules/@types/jss';

const styles = (theme:Theme) => ({
  avatar: {
    height: '10rem',
    width: '10rem',
  },
  card: {
    'background-color': '#F2F3F3',
    [theme.breakpoints.down('md')]: {
      width: '20rem',
    },
    [theme.breakpoints.up('md')]: {
      width: '25rem',
    },
    [theme.breakpoints.up('lg')]: {
      width: '45rem',
    },
    display: 'flex',
    'flex-direction': 'column',
    'margin-top': '5rem',
    'margin-left': '30rem',
  },
  content: {
    'margin-left': '3rem',
    'margin-top': '3rem',
  },
  nameText: {
    'margin-top': '1rem',
    'font-size': '2rem',
    'font-family': 'system-ui',
  },
  companyText: {
    'font-size': '1.5rem',
  },
  editButton: {
    'margin-left': '1rem',
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
    return (
      <Card className={classes.card}>
        <CardContent className={classes.content}>
          <UserAvatar className={classes.avatar} src={this.props.user.avatar_url} />
          <Typography className={classes.nameText}>
            {user.name}
          </Typography>
          <Typography className={classes.companyText}>
            {user.company}
          </Typography>
          <ParnersProfile/>
        </CardContent>
        <CardActions>
          {/*<IconButton>
            <Edit
              className={classes.editButton}
              onClick={this.toggleEditUser}
            />
          </IconButton>*/}
        </CardActions>
      </Card>
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
