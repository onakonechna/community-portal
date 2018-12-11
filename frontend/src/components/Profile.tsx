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
import fetchStatistic from '../api/FetchStatistic';
import fetchUser from '../api/FetchUser';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';

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
    const currentUser = this.props.match.params.user_id;

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

	handleClickOpen = (repositori:string) => {
		this.setState({ [repositori]: true });
	};

	handleClose = (repositori:string) => {
		this.setState({ [repositori]: false });
	};

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
      <div>
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
        <Card className={classes.statistic}>
					<CardContent className={classes.content}>
						<div className={classes.table}>
              <div className={classes.statisticTitle}>
                Contributor statistic:
              </div>
              {
                this.state.statistic.map((item:any) =>
                  <div className={classes.row} key={item.repository}>
                    <div className={classes.statisticHeader}>
                        <a href={`https://github.com/${item.repository}`} target={'_blank'} className={classes.statisticHeaderLink}>{item.repository}</a>
                        <div className={`${classes.table} ${classes.statisticContainer}`}>
                          <div className={classes.row}>
                            <div className={classes.cell}>Points:</div>
                            <div className={classes.cell}>{item.points}</div>
                          </div>
													<div className={classes.row}>
														<div className={classes.cell}>Achievements:</div>
														<div className={classes.cell}>
                              {Object.keys(item.achievements).map((achievement:string) =>
                            <div key={achievement}>
															{`${achievement}, ${item.achievements[achievement]} in total`}
                            </div>)}</div>
													</div>
													<div className={classes.row}>
														<div className={classes.cell}>Created:</div>
														<div className={classes.cell}>{item.createdQuantity}</div>
													</div>
													<div className={`${classes.row} ${!item.closedQuantity && classes.lastChildBorder}`}>
														<div className={`${classes.cell}`}>Merged:</div>
														<div className={`${classes.cell} ${classes.cellButton}`} onClick={() => {this.handleClickOpen(`${item.repository}-merged`)}}>{item.mergedQuantity}</div>
													</div>
                          {!!item.closedQuantity && <div className={`${classes.row} ${classes.lastChildBorder}`}>
														<div className={classes.cell}>Closed:</div>
														<div className={`${classes.cell} ${classes.cellButton}`} onClick={() => {this.handleClickOpen(`${item.repository}-closed`)}}>{item.closedQuantity}</div>
													</div>}
                        </div>
                      <Dialog
												open={!!this.state[`${item.repository}-merged`]}
												onClose={this.handleClose.bind(this, `${item.repository}-merged`)}
												scroll={this.state.scroll}
												aria-labelledby="scroll-dialog-title"
											>
												<DialogTitle id="scroll-dialog-title">Merged Pull Requests:</DialogTitle>
												<DialogContent>
													<DialogContentText>
														<div className={classes.table}>
															<div className={classes.row}>
																<div className={`${classes.cell} ${classes.detailsCell} ${classes.detailsCellHeader}`}>Pull Request:</div>
																<div className={`${classes.cell} ${classes.detailsCell} ${classes.detailsCellHeader}`}>Achievements:</div>
																<div className={`${classes.cell} ${classes.detailsCell} ${classes.detailsCellHeader}`}>Points:</div>
																<div className={`${classes.cell} ${classes.detailsCell} ${classes.detailsCellHeader}`}>Created:</div>
																<div className={`${classes.cell} ${classes.detailsCell} ${classes.detailsCellHeader}`}>Merged:</div>
															</div>
															{item.merged.map((pr:any) =>
																<div className={classes.row} key={`${pr.full}/${pr.pr_number}`}>
                                  <div className={`${classes.cell} ${classes.detailsCell}`}><a target={'_blank'} href={`https://github.com/${pr.full}/pull/${pr.pr_number}`}>{`${pr.full}/${pr.pr_number}`}</a></div>
																	<div className={`${classes.cell} ${classes.detailsCell}`}>{pr.achievements}</div>
																	<div className={`${classes.cell} ${classes.detailsCell}`}>{pr.points}</div>
																	<div className={`${classes.cell} ${classes.detailsCell}`}>{new Date(pr.created_at).toLocaleDateString()}</div>
																	<div className={`${classes.cell} ${classes.detailsCell}`}>{new Date(pr.closed_at).toLocaleDateString()}</div>
																</div>)}
														</div>
													</DialogContentText>
												</DialogContent>
												<DialogActions>
													<Button onClick={this.handleClose.bind(this, `${item.repository}-merged`)} color="primary">
														Close
													</Button>
												</DialogActions>
											</Dialog>
											<Dialog
												open={!!this.state[`${item.repository}-closed`]}
												onClose={this.handleClose.bind(this, `${item.repository}-closed`)}
												scroll={this.state.scroll}
												aria-labelledby="scroll-dialog-title"
											>
												<DialogTitle id="scroll-dialog-title">Closed Pull Requests:</DialogTitle>
												<DialogContent>
													<DialogContentText>
														<div className={classes.table}>
															<div className={classes.row}>
																<div className={`${classes.cell} ${classes.detailsCell} ${classes.detailsCellHeader}`}>Pull Request:</div>
																<div className={`${classes.cell} ${classes.detailsCell} ${classes.detailsCellHeader}`}>Created:</div>
															</div>
															{item.closed.map((pr:any) =>
																<div className={classes.row} key={`${pr.full}/${pr.pr_number}`}>
																	<div className={`${classes.cell} ${classes.detailsCell}`}><a target={'_blank'} href={`https://github.com/${pr.full}/pull/${pr.pr_number}`}>{`${pr.full}/${pr.pr_number}`}</a></div>
																	<div className={`${classes.cell} ${classes.detailsCell}`}>{new Date(pr.created_at).toLocaleDateString()}</div>
																</div>)}
														</div>
													</DialogContentText>
												</DialogContent>
												<DialogActions>
													<Button onClick={this.handleClose.bind(this, `${item.repository}-closed`)} color="primary">
														Close
													</Button>
												</DialogActions>
											</Dialog>
                      </div>
                  </div>
                )
              }
            </div>
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

const mapDispatchToProps = (dispatch: Dispatch) => {

};

export default compose<{}, ProfileProps>(
  withStyles(styles, {
    name: 'Profile',
  }),
  connect<ProfileMapProps, ProfileDispatchProps, ProfileProps>(mapStateToProps, mapDispatchToProps),
)(Profile);
