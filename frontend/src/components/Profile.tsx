import * as React from 'react';
import { connect } from 'react-redux';
import compose from 'recompose/compose';

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import { withStyles, Theme } from '@material-ui/core/styles';
import { Classes } from 'node_modules/@types/jss';
import fetchStatistic from '../api/FetchStatistic';
import fetchUser from '../api/FetchUser';
import ContributionPointsWidget from './profile/widget/ContributionPoints';
import ContritutionGraphWidget from './profile/widget/ContritutionGraphWidget';
import ProfileWidget from './profile/widget/ProfileWidget';
import RateWidget from './profile/widget/RateWidget';

const styles = (theme: Theme) => ({
  avatar: {
    height: '10rem',
    width: '10rem',
  },
	statistic: {
    width: '85%',
    margin: '20px auto',
    'background-color': '#F2F3F3',
		'font-family': 'system-ui'
	},
	statisticHeader: {
    fontSize: '1.2rem',
		'color': '#000000',
		'margin-top': '10px',
		'margin-bottom': '10px',
    'overflow': 'hidden'
	},
	statisticHeaderLink: {
		'color': '#000000',
	},
	statisticTitle: {
		fontSize: '1.5rem',
		'color': '#000000',
		'text-transform': 'uppercase',
    'margin-bottom': '10px',
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
	widgetContainer: {
		'background-color': '#F2F3F3',
		'margin': '20px auto',
		'width': '98%',
		'min-width': '530px'
	},
  content: {
    'margin-top': '3rem',
    display: 'flex',
    'flex-wrap': 'wrap',
    'flex-direction': 'row',
    'justify-content': 'center',
    'align-items': 'auto',
    'align-content': 'center',
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
	table: {
    display: 'table',
    width: '100%'
  },
  row: {
    display: 'table-row',
  },
  lastChildBorder: {
		"& div": {
			'border-bottom': '1px solid lightgray'
		}
  },
  cell: {
    display: 'table-cell',
		'border-top': '1px solid lightgray'
  },
  statisticContainer: {
		'font-size': '1rem',
    'margin': '15px 20px',
    'line-height': '24px',
  },
	detailsTitle: {
    padding: '20px 0'
  },
  detailsCell: {
		padding: '10px',
    'font-size': '13px',
    'border-top': '1px solid lightgray'
  },
	detailsCellHeader: {
    color: '#000'
  },
	heading: {
    'font-size': '16px'
  },
	cellButton: {
    'text-decoration': 'underline',
    'cursor': 'pointer'
  }
});

interface ProfileProps {
  classes: Classes;
  match: any;
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

class Profile extends React.Component<ProfileProps & ProfileMapProps & ProfileDispatchProps, any> {
  constructor(props: ProfileProps & ProfileMapProps & ProfileDispatchProps) {
    super(props);
    this.state = {
      editUserOpen: false,
      displayedUser: null,
      message: '',
      statistic: [],
			scroll: 'paper',
    };

    this.toggleEditUser = this.toggleEditUser.bind(this);
  }

  componentDidMount() {
    const currentUser = this.props.match.params.user_id || this.props.match.params.login;

    fetchUser(currentUser)
      .then((displayedUser: any) => {
        this.setState({ displayedUser: displayedUser.data });
      })
      .catch((err: Error) => {
        this.setState({ message: 'User not Found' });
      });

		fetchStatistic(currentUser).then((data:any) => {
		  this.setState({statistic: data.data});
		 })
  }

  toggleEditUser() {
    this.setState((prevState: any) => ({
      editUserOpen: !prevState.editUserOpen,
    }));
  }

  render() {
    const { classes } = this.props;

    return (
      <div>
          <Card className={classes.widgetContainer}>
              <CardContent className={classes.content}>
										<ContributionPointsWidget statistic={this.state.statistic}/>
										<ProfileWidget displayUser={this.state.displayedUser}/>
										<ContritutionGraphWidget statistic={this.state.statistic}/>
										<RateWidget statistic={this.state.statistic} user={this.props.user}/>
              </CardContent>
          </Card>
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

export default compose<{}, ProfileProps>(
  withStyles(styles, {name: 'Profile'}),
  connect<ProfileMapProps, ProfileDispatchProps, ProfileProps>(mapStateToProps, {}),
)(Profile);
