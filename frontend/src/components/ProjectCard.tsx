import * as React from 'react';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import WithAuth from './WithAuth';
import EditProjectDialog from './EditProjectDialog';

import EditButton from './buttons/EditButton';
import Message from './Message';

import withStyles from '@material-ui/core/styles/withStyles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Chip from '@material-ui/core/Chip';
import LinesEllipsis from 'react-lines-ellipsis';
import * as draftjsTohtml from "draftjs-to-html";

import StarringProjectButton from './buttons/StarringProjectButton';
import BookmarkButton from './projects/Bookmark';
import ContributorsList from './projects/ContributorsList';
import GithubButton from './buttons/GithubButton';
import SlackButton from './buttons/SlackButton';
import AuthorizedUserRole from './roles/AuthorizedUserRole';
import _find from "lodash/find";

const styles = (theme: any) => ({
  contributorDiv: {
    display: 'flex',
    position: 'absolute' as 'absolute',
    top: '22rem',
  },
  bookmark: {
    'margin-left': 'auto',
    [theme.breakpoints.down('md')]: {
      position: 'relative' as 'relative',
      bottom: '0.5rem',
    },
  },
  card: {
    'background-color': '#f7f8f8',
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
  progressDiv: {
    'margin-left': 'auto',
    position: 'absolute' as 'absolute',
    left: '20rem',
    [theme.breakpoints.down('md')]: {
      left: '12rem',
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
  labels: {
    position: 'absolute' as 'absolute',
    top: '15rem',
  },
  row: {
    display: 'flex',
    position: 'absolute' as 'absolute',
    top: '3rem',
  },
  sidebar: {
    display: 'flex',
    'flex-direction': 'column',
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
  contributorText: {
    'fontSize': '0.8rem',
    'display': 'flex',
    'position': 'absolute' as 'absolute',
    'top': '25rem',
  },
  topContributorText: {
    'fontSize': '0.8rem',
    'display': 'flex',
    'position': 'absolute' as 'absolute',
    'top': '20.5rem',
    'font-weight': 'bold'
  },
});

interface CardProps {
  project: {
    project_id: string,
    github_project_id: string,
    name?: string,
    description: string,
    short_description: string,
    status: string,
    estimated: number,
    upvotes: number,
    owner: string,
    size?: string,
    tags: [string],
    technologies: [string],
    completed?: number,
    due_date?: string,
    hours_goal?: number,
    github_address: string,
    slack_channel?: string,
    created: number,
  };
  handler?: () => void;
  toggleEdit?: () => void;
  classes?: any;
  history?: any;
}

interface DispatchProps {
  addStarredProject: any;
  removeStarredProject: any;
  updateProjectStars: any;
}

interface CardState {
  editOpen: boolean;
  messageOpen: boolean;
  errorMessage: string;
}

const Edit = WithAuth(['owner', 'user'], ['project:write'])(EditButton);

export class ProjectCard extends React.Component<any, CardState>{

  constructor(props: CardProps & DispatchProps) {
    super(props);
    this.state = {
      editOpen: false,
      messageOpen: false,
      errorMessage: '',
    };

    this.toggleEdit = this.toggleEdit.bind(this);
    this.toggleStatus = this.toggleStatus.bind(this);
    this.handleMessageClose = this.handleMessageClose.bind(this);
  }


  calculateOpenTime(date: number) {
    const midnight = new Date();
    const timestamp = new Date(date).getTime();
    midnight.setHours(0, 0, 0, 0);
    const midnightStamp = +midnight;
    const dateDifference = Math.floor(((midnightStamp - timestamp) / 1000) / (3600 * 24));
    switch (dateDifference) {
      case -1:
        return 'Opened today';
      case 0:
        return 'Opened yesterday';
      default:
          var timestampDate = new Date(timestamp);
          var year = Math.floor((midnight.getTime() - timestampDate.getTime()) / (1000 * 3600 * 24 * 365));
          var months = (midnight.getMonth() + 12 * midnight.getFullYear()) - (timestampDate.getMonth() + 12 * timestampDate.getFullYear());
          months = months%12;

          var yearLabel = (year == 1) ? 'year' : 'years';
          var monthLabel = (months == 1) ? 'month' : 'months';

          if (dateDifference < 30) {
              return `Opened ${dateDifference + 1} days ago`;
          } else if (year > 0) {
              return 'Opened ' + year + ' ' + yearLabel + ' ' + months + ' ' + monthLabel + ' ago';
          } else {
              return 'Opened ' + months + ' ' + monthLabel + ' ago';
          }
    }
  }

	goDetail = () => this.props.history.push(`./project/${this.props.project.id}`);

  toggleStatus(field: string) {
    this.setState((prevState: CardState) => ({
      ...prevState,
      [field]: !prevState[field],
    }));
  }

  isStarred = project => !!_find(
		this.props.user['upvoted_projects'],
		(starred:any) => starred.id == project.id);

  toggleEdit() {
    this.setState((prevState: CardState) => ({
      editOpen: !prevState.editOpen,
    }));
  }

  handleMessageClose() {
    this.setState({messageOpen: false});
  }

  getHtml = () => this.props.project.short_description?
    draftjsTohtml(JSON.parse(this.props.project.short_description)) : '<b>Loading</b>';

  render() {
    const { classes } = this.props;
    const html = {
      __html: this.getHtml()
    };
    const openedFor = this.calculateOpenTime(this.props.project.created_at);
    return (
      <div>
        <EditProjectDialog
          open={this.state.editOpen}
          toggleEdit={this.toggleEdit}
          project={this.props.project}
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
              <AuthorizedUserRole requestLogin>
                <BookmarkButton project={this.props.project} bookmarkClass={classes.bookmark}/>
              </AuthorizedUserRole>
            </div>
            <div className={classes.row}>
              <div className={classes.sidebar}>
                <Typography className={classes.smallText}>
                  {openedFor}
                </Typography>
              </div>
            </div>
            <Typography
              dangerouslySetInnerHTML={html}
              className={classes.description}
            />
            <div className={classes.labels}>
              {this.props.project.technologies && this.props.project.technologies.slice(0, 5).map((technology:any) => (
                <Chip className={classes.chip} key={technology} label={technology} />
              ))}
            </div>
            <ContributorsList
                project={this.props.project}
                contributorsListClass={this.props.classes.contributorDiv}
                numberOfContributors="10"
                contributorTextClass={this.props.classes.contributorText}
                topContributorTextClass={this.props.classes.topContributorText}
            />
          </CardContent>
          <CardActions className={classes.cardAction}>
            <GithubButton url={this.props.project.github_address}/>
            <SlackButton url={this.props.project.slack_channel} />
            <Edit handler={this.toggleEdit} />
						<StarringProjectButton url={this.props.project.github_address} starred={this.isStarred(this.props.project)}/>
            <Typography className={classes.upvotes}>{this.props.project.stargazers_count}</Typography>
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

const mapStateToProps = (state:any, props:any) => ({
	user: state.user
});

export default compose<{}, any>(
  withStyles(styles, {name: 'ProjectCard'}),
  connect<{}, {}, any>(mapStateToProps, {}))(ProjectCard);
