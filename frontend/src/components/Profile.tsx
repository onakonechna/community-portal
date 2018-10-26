import * as React from 'react';
import { connect } from 'react-redux';
import compose from 'recompose/compose';

import UserAvatar from '@material-ui/core/Avatar';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import { withStyles, Theme } from '@material-ui/core/styles';
import ParnersProfile from './partners/pages/Profile';
import Edit from '@material-ui/icons/Edit';
import { Classes } from '../../node_modules/@types/jss';
import { Dispatch } from '../../node_modules/redux';

import fetchUser from '../api/FetchUser';

const styles = (theme: Theme) => ({
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
    display: 'none',
    'margin-left': '1rem',
  },
});

interface ProfileProps {
  classes: Classes;
  match: any;
}

interface ProfileState {
  editUserOpen: boolean;
  displayedUser: any;
  message: string;
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
      displayedUser: null,
      message: '',
    };
    this.toggleEditUser = this.toggleEditUser.bind(this);
  }

  componentDidMount() {
    const currentUser = this.props.match.params.user_id;
    fetchUser(currentUser)
      .then((displayedUser: any) => {
        this.setState({ displayedUser: displayedUser.data });
      })
      .catch((err: Error) => {
        this.setState({ message: 'User not Found' });
      });
  }

  toggleEditUser() {
    this.setState((prevState: ProfileState) => ({
      editUserOpen: !prevState.editUserOpen,
    }));
  }

  render() {
    const { classes } = this.props;
    const { displayedUser } = this.state;
    const cardContent = displayedUser
      ?
        <span>
          <UserAvatar className={classes.avatar} src={displayedUser.avatar_url} />
          <Typography className={classes.nameText}>
            {displayedUser.name}
          </Typography>
          <Typography className={classes.companyText}>
            {displayedUser.company}
          </Typography>
          <ParnersProfile/>
        </span>
      : <Typography style={{ fontSize: '3rem', textAlign: 'center' }}>
          {this.state.message}
        </Typography>;

    return (
      <Card className={classes.card}>
        <CardContent className={classes.content}>
          {cardContent}
        </CardContent>
        <CardActions>
          <IconButton>
            <Edit
              className={classes.editButton}
              onClick={this.toggleEditUser}
            />
          </IconButton>
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

const mapDispatchToProps = (dispatch: Dispatch) => {

};

export default compose<{}, ProfileProps>(
  withStyles(styles, {
    name: 'Profile',
  }),
  connect<ProfileMapProps, ProfileDispatchProps, ProfileProps>(mapStateToProps, mapDispatchToProps),
)(Profile);
