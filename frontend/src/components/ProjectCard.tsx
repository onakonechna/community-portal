import * as React from 'react';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import { likeProject } from '../actions';
import WithAuth from './WithAuth';
import EditProjectDialog from './EditProjectDialog';
import PledgeDialog from './PledgeDialog';
import EditButton from './buttons/EditButton';
import LikeProjectButton from './buttons/LikeProjectButton';
import PledgeButton from './buttons/PledgeButton';
import ContributorAvatar from './ContributorAvatar';

import { withStyles } from '@material-ui/core/styles';

import { CardActions, CardContent } from '@material-ui/core';
import Card from '@material-ui/core/Card';
import IconButton from '@material-ui/core/IconButton';
import SvgIcon from '@material-ui/core/SvgIcon';
import Typography from '@material-ui/core/Typography';

import Chip from '@material-ui/core/Chip';
import CircularProgress from '@material-ui/core/CircularProgress';

const styles = (theme:any) => ({
  avatar: {
    margin: 10,
  },
  card: {
    'background-color': '#F2F3F3',
    height: '25rem',
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
  },
  cardContent: {
    'margin-bottom': 'auto',
  },
  centered: {
    display: 'flex',
    justifyContent: 'left',
    'font-size': '2rem',
    'margin-bottom': '1rem',
  },
  chip: {
    margin: '1.5rem 1rem 1rem 0',
    borderRadius: '5px',
  },
  contributorDiv: {
    display: 'flex',
  },
  contributorText: {
    'font-size': '1rem',
    'font-weight': '300',
    'margin-left': '2rem',
    'margin-top': 'auto',
  },
  description: {
    'max-width': '24rem',
    'text-align': 'justify',
    'font-size': '1rem',
    'font-family': 'system-ui',
  },
  estimatedText: {
    'font-weight': '200',
  },
  github: {
    'margin-left': 'auto',
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
    position: 'relative' as 'relative',
  },
  row: {
    display: 'flex',
  },
  sidebar: {
    display: 'flex',
    'flex-direction': 'column',
  },
  smallText: {
    'margin-bottom': '0.25rem',
  },
  upvotes: {
    'font-size': '1rem',
    color: '#27A2AA',
  },
});

interface CardProps {
  project: {
    project_id: string,
    name?: string,
    description: string,
    status: string,
    estimated?: number,
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
    slack?: string,
    created: number,
    pledge: any;
  };
  handler?: () => void;
  toggleEdit?: () => void;
  classes?: any;
  liked: boolean;
}

interface DispatchProps {
  likeProject: any;
}

interface CardState {
  editOpen: boolean;
  pledgeOpen: boolean;
  liked: boolean;
}

const Pledge = WithAuth(['owner', 'user'])(PledgeButton);
const Edit = WithAuth(['owner', 'user'])(EditButton);
const Like = WithAuth(['user'])(LikeProjectButton);

export class ProjectCard extends React.Component<CardProps & DispatchProps, CardState>{

  constructor(props: CardProps & DispatchProps) {
    super(props);
    this.state = {
      editOpen: false,
      pledgeOpen: false,
      liked: this.props.liked,
    };
    this.toggleEdit = this.toggleEdit.bind(this);
    this.handleLike = this.handleLike.bind(this);
    this.togglePledge = this.togglePledge.bind(this);
  }

  componentWillReceiveProps(nextProps:any) {
    this.setState({
      liked: nextProps.liked,
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

  countContributors(project: any) {
    const contributors = Object.keys(project.pledgers);
    const numOfPledgers = contributors.length;
    switch (numOfPledgers) {
      case 0:
        return 'No contributors yet';
      case 1:
        return '1 Contributor';
      default:
        return `${numOfPledgers} Contributors`;
    }
  }

  getPercentage() {
    const { estimated, pledged } = this.props.project;
    if (!pledged || !estimated || pledged === 0) { return 0; }
    return (pledged / estimated) * 100;
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

  toggleLike() {
    this.setState((prevState: CardState) => ({
      liked: !prevState.liked,
    }));
  }

  handleLike() {
    const { project_id } = this.props.project;
    if (!this.state.liked) {
      this.props.likeProject(project_id)
        .then((response: any) => {
          this.toggleLike();
        })
        .catch((err: Error) => {
          console.error(err);
        });
    }
  }

  render() {
    const { classes } = this.props;
    const { pledgers } = this.props.project;
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
        />
        <Card className={classes.card}>
          <CardContent className={classes.cardContent}>
            <Typography className={classes.centered}>
              {this.props.project.name}
            </Typography>
            <Typography className={classes.description} component="p">
              {this.props.project.description}
            </Typography>
            {this.props.project.technologies.map(technology => (
              <Chip className={classes.chip} key={technology} label={technology} />
            ))}
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
                  size={90}
                  value={this.getPercentage()}
                />
                <CircularProgress
                  variant="static"
                  style={{ color: '#A9A9A9' }}
                  size={90}
                  value={100}
                />
                <Typography className={classes.progressText}>
                  {`${this.props.project.pledged}/`}
                  <label className={classes.estimatedText}>{`${this.props.project.estimated}\n`}</label>
                  <label>hours</label>
                </Typography>
              </div>
            </div>
            <div className={classes.contributorDiv}>
              {Object.keys(pledgers).length > 0
                ? Object.keys(pledgers).map(pledger => (
                  <ContributorAvatar key={pledger} avatar_url={pledgers[pledger].avatar_url} />
                ))
                : null}
              <Typography className={classes.contributorText}>{this.countContributors(this.props.project)}</Typography>
            </div>
          </CardContent>
          <CardActions>
            <Pledge handler={this.togglePledge} label="Pledge" />
            <a className={classes.github} href={this.props.project.github_address}>
              <IconButton style={{ color: '#27A2AA' }} aria-label="Git">
                <SvgIcon>
                  <path d="M12.007 0C6.12 0 1.1 4.27.157 10.08c-.944 5.813 2.468 11.45 8.054 13.312.19.064.397.033.555-.084.16-.117.25-.304.244-.5v-2.042c-3.33.735-4.037-1.56-4.037-1.56-.22-.726-.694-1.35-1.334-1.756-1.096-.75.074-.735.074-.735.773.103 1.454.557 1.846 1.23.694 1.21 2.23 1.638 3.45.96.056-.61.327-1.178.766-1.605-2.67-.3-5.462-1.335-5.462-6.002-.02-1.193.42-2.35 1.23-3.226-.327-1.015-.27-2.116.166-3.09 0 0 1.006-.33 3.3 1.23 1.966-.538 4.04-.538 6.003 0 2.295-1.5 3.3-1.23 3.3-1.23.445 1.006.49 2.144.12 3.18.81.877 1.25 2.033 1.23 3.226 0 4.607-2.805 5.627-5.476 5.927.578.583.88 1.386.825 2.206v3.29c-.005.2.092.393.26.507.164.115.377.14.565.063 5.568-1.88 8.956-7.514 8.007-13.313C22.892 4.267 17.884.007 12.008 0z" />
                </SvgIcon>
              </IconButton>
            </a>
            <Edit handler={this.toggleEdit} />
            <Like liked={this.state.liked} handler={this.handleLike} project_id={this.props.project.project_id} />
            <Typography className={classes.upvotes}>{this.props.project.upvotes}</Typography>
          </CardActions>
        </Card>
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch: any) => {
  return {
    likeProject: (id: string) => dispatch(likeProject(id)),
  };
};

export default compose<{}, CardProps>(
  withStyles(styles, {
    name: 'ProjectCard',
  }),
  connect<{}, DispatchProps, CardProps>(null, mapDispatchToProps),
)(ProjectCard);
