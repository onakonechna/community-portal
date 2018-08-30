import * as React from 'react';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import WithAuth from './WithAuth';
import EditProjectDialog from './EditProjectDialog';
import PledgeDialog from './PledgeDialog';
import StartsProjectButton from './projects/Stars';
import BookmarkButton from './buttons/BookmarkButton';
import EditButton from './buttons/EditButton';
import PledgeButton from './buttons/PledgeButton';
import Message from './Message';

import { loadProject, bookmarkProjectAction } from '../actions';

import Avatar from '@material-ui/core/Avatar';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CircularProgress from '@material-ui/core/CircularProgress';
import Chip from '@material-ui/core/Chip';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import SvgIcon from '@material-ui/core/SvgIcon';
import Typography from '@material-ui/core/Typography';

import { withStyles } from '@material-ui/core/styles';

import Slack from '-!svg-react-loader!./../static/images/slack.svg';

import { convertFromRaw } from 'draft-js';
import { stateToHTML } from 'draft-js-export-html';

const styles: any = (theme:any) => ({
  bookmark: {
    'margin-left': 'auto',
    [theme.breakpoints.down('md')]: {
      position: 'relative' as 'relative',
    },
  },
  bottomButtons: {
    position: 'relative' as 'relative',
    bottom: '0.1rem',
  },
  titleText: {
    [theme.breakpoints.down('sm')]: {
      width: '85%',
      fontSize: '1.2em',
    },
    [theme.breakpoints.up('sm')]: {
      width: '90%',
      fontSize: '1.5em',
    },
    [theme.breakpoints.up('md')]: {
      width: '92%',
      fontSize: '1.8em',
    },
    [theme.breakpoints.up('lg')]: {
      width: '94%',
      fontSize: '2em',
    },
    fontWeight: '500',
    margin: 'auto',
    'overflow-wrap': 'break-word',
  },
  grid: {
    [theme.breakpoints.down('sm')]: {
      width: '20rem',
    },
    [theme.breakpoints.up('sm')]: {
      width: '30rem',
    },
    [theme.breakpoints.up('md')]: {
      width: '40rem',
    },
    [theme.breakpoints.up('lg')]: {
      width: '55rem',
    },
    display: 'flex',
    'flex-direction': 'column',
    margin: 'auto',
    'margin-top': '1rem',
  },
  card: {
    'background-color': '#F2F3F3',
    width: '100%',
  },
  chip: {
    margin: '0 1rem 0 0',
    borderRadius: '5px',
  },
  content: {
    margin: '1rem',
  },
  contributorDiv: {
    display: 'flex',
    flexWrap: 'wrap',
    marginTop: '1rem',
  },
  contributorText: {
    'font-size': '1rem',
    'font-weight': '300',
    'margin-left': '1rem',
    'margin-top': 'auto',
  },
  github: {
    'margin-left': 'auto',
  },
  hourText: {
    'font-size': '1rem',
  },
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
  progressDiv: {
    [theme.breakpoints.down('xs')]: {
      display: 'none',
    },
    'margin-left': 'auto',
    position: 'relative' as 'relative',
  },
  row: {
    display: 'flex',
    width: '100%',
  },
  sidebar: {
    display: 'flex',
    'flex-direction': 'column',
  },
  technologies: {
    marginBottom: '1rem',
  },
  slack: {
    width: '3rem',
    height: '3rem',
    fill: '##27A2AA',
  },
  smallText: {
    fontSize: '0.9rem',
    marginBottom: '0.25rem',
  },
  upvotes: {
    'font-size': '1rem',
    color: '#27A2AA',
    position: 'relative' as 'relative',
    right: '0.5rem',
  },
  description: {
    'font-size': '1rem',
    'font-family': 'system-ui',
  },
});

interface IProject {
  id: string;
  name: string;
  title?: string;
  description: string;
  technologies: [string];
  estimated: number;
  pledged?: number;
  due_date?: string;
  hours_goal?: number;
  github: string;
  slack?: string;
  size?: string;
  backers: [{
    name?: string,
    pledge?: number;
  }];
  created_date: string;
}

interface StateProps {
  project: IProject;
  user: any;
}

interface DispatchProps {
  loadProject: (project_id: string) => void;
  bookmarkProject: any;
}

interface ProjectDetailsProps {
  project_id: string;
  project?: any;
  user?: any;
  classes?: any;
}

interface ProjectDetailsState {
  editOpen: boolean;
  pledgeOpen: boolean;
  bookmarked: boolean;
  messageOpen: boolean;
  errorMessage: string;
}

const Pledge = WithAuth(['owner', 'user'])(PledgeButton);
const Edit = WithAuth(['owner', 'user'], ['write:project'])(EditButton);
const Bookmark = WithAuth(['owner', 'user'])(BookmarkButton);
const Stars = WithAuth(['user'])(StartsProjectButton);

export class ProjectDetails extends React.Component<any, ProjectDetailsState> {
  constructor(props: ProjectDetailsProps & DispatchProps) {
    super(props);
    this.state = {
      editOpen: false,
      pledgeOpen: false,
      bookmarked: this.checkBookmark(this.props.project.project_id),
      messageOpen: false,
      errorMessage: '',
    };
    this.toggleEdit = this.toggleEdit.bind(this);
    this.handleBookmark = this.handleBookmark.bind(this);
    this.togglePledge = this.togglePledge.bind(this);
    this.handleMessageChange = this.handleMessageChange.bind(this);
    this.handleMessageClose = this.handleMessageClose.bind(this);
  }

  calculateOpenTime(timestamp: number) {
    const midnight = new Date();
    midnight.setHours(0, 0, 0, 0);
    const midnightStamp = +midnight;
    const dateDifference = Math.floor(((midnightStamp - timestamp) / 1000) / (3600 * 24));
    switch (dateDifference) {
      case -1:
        return 'Opened today';
      case 0:
        return 'Opened yesterday';
      default:
        return `Opened ${dateDifference + 1} days ago`;
    }
  }

  getPercentage(project: any) {
    const numOfPledgers = Object.keys(project.pledgers).length;
    const { estimated } = this.props.project;
    return (numOfPledgers / estimated) * 100;
  }

  checkBookmark(id: string) {
    return this.props.user.bookmarkedProjects.indexOf(id) !== -1;
  }

  checkJoin() {
    const { user_id } = this.props.user;
    const { pledgers } = this.props.project;
    if (typeof pledgers === 'undefined') return false;
    return Object.keys(pledgers).indexOf(user_id) !== -1;
  }

  update(project_id: string) {
    this.props.loadProject(project_id);
  }

  componentDidMount() {
    this.update(this.props.project_id);
  }

  toggleEdit() {
    this.setState((prevState: ProjectDetailsState) => ({
      editOpen: !prevState.editOpen,
    }));
  }

  togglePledge() {
    this.setState((prevState: ProjectDetailsState) => ({
      pledgeOpen: !prevState.pledgeOpen,
    }));
  }

  toggleBookmark() {
    this.setState((prevState: ProjectDetailsState) => ({
      bookmarked: !prevState.bookmarked,
    }));
  }

  handleBookmark() {
    const { project_id } = this.props.project;
    if (!this.state.bookmarked) {
      this.props.bookmarkProject(project_id)
        .then((response: any) => {
          this.toggleBookmark();
        })
        .catch((err: Error) => {
          this.onFailure(new Error('Something went wrong while bookmarking this project'));
        });
    }
  }

  handleMessageChange(message: string) {
    this.setState({
      errorMessage: message,
      messageOpen: true,
    });
  }

  handleMessageClose() {
    this.setState({
      messageOpen: false,
    });
  }

  onFailure(error: Error) {
    this.handleMessageChange(error.message);
  }

  getDate(timestamp: number) {
    const date = new Date(timestamp);
    const year = date.getFullYear();
    const month = date.getMonth();
    const day = date.getDate();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }

  countContributors(project: any) {
    const numOfPledgers = Object.keys(project.pledgers).length;
    switch (numOfPledgers) {
      case 0:
        return 'No contributors yet';
      case 1:
        return '1 Contributor';
      default:
        return `${numOfPledgers} Contributors`;
    }
  }

  render() {
    const { classes } = this.props;
    const { pledgers } = this.props.project;
    const openedFor = this.calculateOpenTime(this.props.project.created);
    const content = this.props.project.description ? stateToHTML(convertFromRaw(JSON.parse(this.props.project.description)))
      : '<b>loading</b>';
    const html = {
      __html: content,
    };
    return (
      <div>
        <EditProjectDialog
          open={this.state.editOpen}
          toggleEdit={this.toggleEdit}
          project={this.props.project}
        />
        <PledgeDialog
          open={this.state.pledgeOpen}
          project={this.props.project}
          toggle={this.togglePledge}
          join={() => {}}
          joined={this.checkJoin()}
        />
        <Grid
          container
          justify="center"
          className={classes.grid}
        >
          <div className={classes.row}>
            <Typography className={classes.titleText}>
              {this.props.project.name}
            </Typography>
            <Bookmark
              bookmarked={this.checkBookmark(this.props.project.project_id)}
              className={classes.bookmark}
              handler={this.handleBookmark}
              project_id={this.props.project.project_id}
            />
          </div>
          <Card className={classes.card}>
            <CardContent className={classes.content}>
              <Typography
                className={classes.description}
                dangerouslySetInnerHTML={html}
              />
              <div className={classes.row}>
                <div className={classes.sidebar}>
                  <div className={classes.technologies}>
                    {this.props.project.technologies.slice(0, 5).map((technology: any) => (
                      <Chip className={classes.chip} key={technology} label={technology} />
                    ))}
                  </div>
                  <Typography className={classes.smallText}>
                    {openedFor}
                  </Typography>
                  <Typography className={classes.smallText}>
                    Size: {this.props.project.size}
                  </Typography>
                </div>
                <div className={classes.progressDiv}>
                  <CircularProgress
                    className={classes.progress}
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
                  <Typography className={classes.progressText}>
                    {`${Object.keys(this.props.project.pledgers).length}/`}
                    <label className={classes.estimatedText}>{`${this.props.project.estimated}`}</label>
                    <Typography className={classes.hourText}>{`joined`}</Typography>
                  </Typography>
                </div>
              </div>
              <div className={classes.contributorDiv}>
                {this.props.project.pledgers && <div className={classes.contributorDiv}>
                  {Object.keys(pledgers).length > 0
                    ? Object.keys(pledgers).map(pledger => (
                      <Avatar key={pledger} src={pledgers[pledger].avatar_url} />
                    ))
                    : null}
                  <Typography className={classes.contributorText}>{this.countContributors(this.props.project)}</Typography>
                </div>}
              </div>
            </CardContent>
            <CardActions className={classes.cardAction}>
              <Pledge handler={this.togglePledge} label="Join" />
              <a className={classes.github} href={this.props.project.github_address} target="_blank">
                <IconButton style={{ color: '#27A2AA' }} aria-label="Git">
                  <SvgIcon>
                    <path d="M12.007 0C6.12 0 1.1 4.27.157 10.08c-.944 5.813 2.468 11.45 8.054 13.312.19.064.397.033.555-.084.16-.117.25-.304.244-.5v-2.042c-3.33.735-4.037-1.56-4.037-1.56-.22-.726-.694-1.35-1.334-1.756-1.096-.75.074-.735.074-.735.773.103 1.454.557 1.846 1.23.694 1.21 2.23 1.638 3.45.96.056-.61.327-1.178.766-1.605-2.67-.3-5.462-1.335-5.462-6.002-.02-1.193.42-2.35 1.23-3.226-.327-1.015-.27-2.116.166-3.09 0 0 1.006-.33 3.3 1.23 1.966-.538 4.04-.538 6.003 0 2.295-1.5 3.3-1.23 3.3-1.23.445 1.006.49 2.144.12 3.18.81.877 1.25 2.033 1.23 3.226 0 4.607-2.805 5.627-5.476 5.927.578.583.88 1.386.825 2.206v3.29c-.005.2.092.393.26.507.164.115.377.14.565.063 5.568-1.88 8.956-7.514 8.007-13.313C22.892 4.267 17.884.007 12.008 0z" />
                  </SvgIcon>
                </IconButton>
              </a>
              <a href={this.props.project.slack_channel} target="_blank">
                <IconButton aria-label="slack" className={classes.bottomButtons}>
                  <SvgIcon className={classes.slack}>
                    <Slack />
                  </SvgIcon>
                </IconButton>
              </a>
              <Edit handler={this.toggleEdit} />
              <Stars project={this.props.project}/>
              <Typography className={classes.upvotes}>{this.props.project.upvotes}</Typography>
            </CardActions>
          </Card>
        </Grid>
        <Message
          message={this.state.errorMessage}
          open={this.state.messageOpen}
          handleClose={this.handleMessageClose}
        />
      </div>
    );
  }
}

const mapStateToProps = (state: any, props: any) => {
  return {
    project: state.project.find((project:any)=> project.project_id === props.project_id),
    user: state.user,
  };
};

const mapDispatchToProps = (dispatch: any) => {
  return {
    loadProject: (project_id: string) => dispatch(loadProject(project_id)),
    bookmarkProject: (project_id: string) => dispatch(bookmarkProjectAction(project_id)),
  };
};

export default compose<{}, ProjectDetailsProps>(
  withStyles(styles, {name: 'ProjectDetails',}),
  connect<StateProps, DispatchProps, ProjectDetailsProps>(mapStateToProps, mapDispatchToProps),
)(ProjectDetails);
