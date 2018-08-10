import * as React from 'react';

import { withStyles } from '@material-ui/core/styles';

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';

import LinesEllipsis from 'react-lines-ellipsis';

const styles = (theme: any) => ({
  card: {
    'background-color': '#F2F3F3',
    [theme.breakpoints.down('md')]: {
      width: '10rem',
    },
    [theme.breakpoints.up('md')]: {
      width: '15rem',
    },
    [theme.breakpoints.up('lg')]: {
      width: '25rem',
    },
    display: 'flex',
    'flex-direction': 'column',
    margin: 'auto',
    'margin-top': '1rem',
    '&:hover': {
      cursor: 'pointer',
      opacity: 0.8,
    },
  },
  content: {
    margin: '.5rem',
  },
  descriptionText: {
    fontSize: '1.25em',
    'font-family': 'system-ui',
  },
});

interface RecommendationCardProps {
  project: {
    project_id: string,
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
  classes: any;
  history?: any;
}

export class RecommendationCard extends React.Component<RecommendationCardProps, {}>{

  constructor(props: RecommendationCardProps) {
    super(props);
    this.goDetail = this.goDetail.bind(this);
  }

  getPercentage(project: any) {
    const numOfPledgers = Object.keys(project.pledgers).length;
    const { estimated } = this.props.project;
    return (numOfPledgers / estimated) * 100;
  }

  goDetail() {
    const { project_id } = this.props.project;
    this.props.history.push(`./${project_id}`);
  }

  render() {
    const { classes } = this.props;
    return (
      <Card className={classes.card}>
        <CardContent className={classes.content} onClick={this.goDetail}>
          <LinesEllipsis
            className={classes.descriptionText}
            text={this.props.project.name}
            maxLine="1"
            ellipsis="..."
            trimRight
            basedOn="letters"
          />
          <LinesEllipsis
            className={classes.descriptionText}
            text={this.props.project.description}
            maxLine="3"
            ellipsis="..."
            trimRight
            basedOn="letters"
          />
        </CardContent>
      </Card>
    );
  }
}

export default withStyles(styles)(RecommendationCard);
