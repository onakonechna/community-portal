import * as React from 'react';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import { bookmarkProjectAction } from '../actions';
import WithAuth from './WithAuth';
import EditProjectDialog from './EditProjectDialog';
import PledgeDialog from './PledgeDialog';

import BookmarkButton from './buttons/BookmarkButton';
import EditButton from './buttons/EditButton';

import PledgeButton from './buttons/PledgeButton';
import Message from './Message';

import { withStyles } from '@material-ui/core/styles';

import Avatar from '@material-ui/core/Avatar';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import IconButton from '@material-ui/core/IconButton';
import SvgIcon from '@material-ui/core/SvgIcon';
import Typography from '@material-ui/core/Typography';

import Chip from '@material-ui/core/Chip';
import CircularProgress from '@material-ui/core/CircularProgress';

import Slack from '-!svg-react-loader!./../static/images/slack.svg';

import LinesEllipsis from 'react-lines-ellipsis';
import { convertFromRaw } from 'draft-js';
import { stateToHTML } from 'draft-js-export-html';

import StartsProjectButton from './projects/Stars';

const styles = (theme: any) => ({
  avatar: {
    margin: 10,
  },
  bookmark: {
    'margin-left': 'auto',
    [theme.breakpoints.down('md')]: {
      position: 'relative' as 'relative',
      bottom: '0.5rem',
    },
  },
  bottomButtons: {
    position: 'relative' as 'relative',
    bottom: '0.1rem',
  },
  card: {
    'background-color': '#F2F3F3',
    height: '30rem',
    [theme.breakpoints.down('md')]: {
      width: '20rem',
    },
    [theme.breakpoints.up('md')]: {
      width: '25rem',
    },
    [theme.breakpoints.up('lg')]: {
      width: '30rem',
    },
    display: 'flex',
    'flex-direction': 'column',
    'justify-content': 'space-between',
    '&:hover': {
      cursor: 'pointer',
      opacity: 0.8,
    },
  },
  cardAction: {
    height: '12%',
  },
  cardContent: {
    height: '88%',
    'margin-bottom': 'auto',
    position: 'relative' as 'relative',
  },
  chip: {
    margin: '1rem 1rem 1rem 0',
    borderRadius: '5px',
  },
  contributorDiv: {
    display: 'flex',
    position: 'absolute' as 'absolute',
    top: '24rem',
  },
  contributorText: {
    'font-size': '1rem',
    'font-weight': '300',
    'margin-left': '1rem',
    'margin-top': 'auto',
  },
  description: {
    height: '10rem',
    overflow: 'hidden',
    'max-width': '24rem',
    'font-size': '1rem',
    'font-family': 'system-ui',
    position: 'absolute' as 'absolute',
    top: '4rem',
    [theme.breakpoints.down('md')]: {
      left: '1rem',
      right: '1rem',
    },
  },
  estimatedText: {
    'font-weight': '200',
  },
  github: {
    'margin-left': 'auto',
  },
  hourText: {
    'display': 'block',
    'font-size': '1rem',
  },
  labels: {
    position: 'absolute' as 'absolute',
    top: '15rem',
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
    'margin-left': 'auto',
    position: 'absolute' as 'absolute',
    left: '20rem',
    [theme.breakpoints.down('md')]: {
      left: '12rem',
    },
  },
  row: {
    display: 'flex',
    position: 'absolute' as 'absolute',
    top: '18.5rem',
  },
  sidebar: {
    display: 'flex',
    'flex-direction': 'column',
  },
  slack: {
    width: '3rem',
    height: '3rem',
    fill: '##27A2AA',
  },
  smallText: {
    'margin-bottom': '0.25rem',
  },
  title: {
    display: 'inline-block',
    'font-size': '1.5rem',
    'font-family': 'system-ui',
    [theme.breakpoints.down('md')]: {
      'font-size': '1rem',
    },
  },
  topRow: {
    display: 'flex',
    width: '100%',
  },
  upvotes: {
    'font-size': '1rem',
    color: '#27A2AA',
    position: 'relative' as 'relative',
    right: '0.5rem',
  },
});

interface CardProps {
  project: {
    project_id: string,
    github_project_id: string,
    name?: string,
    description: string,
    status: string,
    estimated: number,
    pledged?: number,
    upvotes: number,
    owner: string,
    size?: string,
    tags: [string],
    technologies: [string],
    pledgers: [{
      type: string,
      values: any[],
      wrappedName: string,
    }],
    contributors?: [{
      name?: string,
      contributed?: number,
    }]
    completed?: number,
    due_date?: string,
    hours_goal?: number,
    github_address: string,
    slack_channel?: string,
    created: number,
    pledge: any;
  };
  handler?: () => void;
  toggleEdit?: () => void;
  classes?: any;
  history?: any;
  bookmarked: boolean;
  joined: boolean;
}

interface DispatchProps {
  bookmarkProject: any;
  addStarredProject: any;
  removeStarredProject: any;
  updateProjectStars: any;
}

interface CardState {
  editOpen: boolean;
  pledgeOpen: boolean;
  bookmarked: boolean;
  joined: boolean;
  messageOpen: boolean;
  errorMessage: string;
}

const Pledge = WithAuth(['owner', 'user'])(PledgeButton);
const Edit = WithAuth(['owner', 'user'], ['write:project'])(EditButton);
const Bookmark = WithAuth(['owner', 'user'])(BookmarkButton);
const Stars = WithAuth(['user'])(StartsProjectButton);

export class ProjectCard extends React.Component<any, CardState>{

  constructor(props: CardProps & DispatchProps) {
    super(props);
    this.state = {
      editOpen: false,
      pledgeOpen: false,
      bookmarked: this.props.bookmarked,
      joined: this.props.joined,
      messageOpen: false,
      errorMessage: '',
    };
    this.confirmJoin = this.confirmJoin.bind(this);
    this.toggleEdit = this.toggleEdit.bind(this);
    this.handleBookmark = this.handleBookmark.bind(this);
    this.togglePledge = this.togglePledge.bind(this);
    this.toggleStatus = this.toggleStatus.bind(this);
    this.handleMessageChange = this.handleMessageChange.bind(this);
    this.handleMessageClose = this.handleMessageClose.bind(this);
    this.goDetail = this.goDetail.bind(this);
  }

  componentWillReceiveProps(nextProps: any) {
    this.setState({
      bookmarked: nextProps.bookmarked,
    });
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

  confirmJoin() {
    this.setState({ joined: true });
  }

  countContributors(project: any) {
    const numOfPledgers = Object.keys(project.pledgers).length;
    switch (numOfPledgers) {
      case 0:
        return 'Nobody joined yet';
      case 1:
        return '1 Contributor';
      default:
        return `${numOfPledgers} Contributors`;
    }
  }

  getPercentage(project: any) {
    const numOfPledgers = Object.keys(project.pledgers).length;
    const { estimated } = this.props.project;
    return (numOfPledgers / estimated) * 100;
  }

  goDetail() {
    const { project_id } = this.props.project;
    this.props.history.push(`./project/${project_id}`);
  }

  goProfile(user_id:string, e: any) {
    e.stopPropagation();
    this.props.history.push(`./profile/${user_id}`);
  }

  triggerBookmark(e:any) {
    e.stopPropagation();
    this.handleBookmark();
  }

  toggleStatus(field: string) {
    this.setState((prevState: CardState) => ({
      ...prevState,
      [field]: !prevState[field],
    }));
  }

  toggleEdit() {
    this.setState((prevState: CardState) => ({
      editOpen: !prevState.editOpen,
    }));
  }

  togglePledge() {
    this.setState((prevState: CardState) => ({
      pledgeOpen: !prevState.pledgeOpen,
    }));
  }

  toggleBookmark() {
    this.setState((prevState: CardState) => ({
      bookmarked: !prevState.bookmarked,
    }));
  }

  handleBookmark() {
    const { project_id } = this.props.project;
    if (!this.state.bookmarked) {
      this.props.bookmarkProject(project_id)
        .then(() => this.toggleBookmark())
        .catch(() => this.onFailure(new Error('Something went wrong while bookmarking this project')));
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

  render() {
    const { classes } = this.props;
    const { pledgers } = this.props.project;
    const html = {
      __html: stateToHTML(convertFromRaw(JSON.parse(this.props.project.description))),
    };
    const openedFor = this.calculateOpenTime(this.props.project.created);
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
          join={this.confirmJoin}
          joined={this.props.joined}
        />
        <Card className={classes.card}>
          <CardContent className={classes.cardContent} onClick={this.goDetail}>
            <div className={classes.topRow}>
              <LinesEllipsis
                className={classes.title}
                text={this.props.project.name}
                maxLine="2"
                ellipsis="..."
                basedOn="words"
              />
              <Bookmark
                bookmarked={this.state.bookmarked}
                className={classes.bookmark}
                handler={(e:any) => this.triggerBookmark(e)}
                project_id={this.props.project.project_id}
              />
            </div>
            <Typography
              dangerouslySetInnerHTML={html}
              className={classes.description}
            />
            <div className={classes.labels}>
              {this.props.project.technologies.slice(0, 5).map((technology:any) => (
                <Chip className={classes.chip} key={technology} label={technology} />
              ))}
            </div>
            <div className={classes.row}>
              <div className={classes.sidebar}>
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
                  <span className={classes.hourText}>{`joined`}</span>
                </Typography>
              </div>
            </div>
            <div className={classes.contributorDiv}>
              {Object.keys(pledgers).length > 0
                ? Object.keys(pledgers).slice(0, 5).map(pledger => (
                  <Avatar onClick={(e) => { this.goProfile(pledger, e); }} key={pledger} src={pledgers[pledger].avatar_url} />
                ))
                : null}
                <Typography className={classes.contributorText}>{this.countContributors(this.props.project)}</Typography>
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
        <Message
          message={this.state.errorMessage}
          open={this.state.messageOpen}
          handleClose={this.handleMessageClose}
        />
      </div>
    );
  }
}

export default compose<{}, any>(
  withStyles(styles, {name: 'ProjectCard'}),
  connect<{}, {}, any>(null, {bookmarkProject: bookmarkProjectAction}))(ProjectCard);
