import * as React from 'react';


// import Button from '@material-ui/core/Button';
import { CardContent, CardMedia } from '@material-ui/core';
import Card from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';
// import SvgIcon from '@material-ui/core/SvgIcon';

import Avatar from '@material-ui/core/Avatar';
import Chip from '@material-ui/core/Chip';
import CircularProgress from '@material-ui/core/CircularProgress';

const styles = {
  avatar: {
    margin: 10
  },
  row: {
    display: 'flex',
    justifyContent: 'center'
  },
}

interface IProps {
    project: {
      id: string,
      name?: string,
      title?: string,
      description: string,
      technologies: [string],
      estimated?: number,
      pledged?: number,
      due_date?: string,
      hours_goal?: number,
      git_link?: string,
      slack_link?: string,
      size?: string,
      backers?: [{
        name?: string,
        pledge?: number
      }],
      created_date?: string 
    },
    handler?: () => void
}

function getPercentage(pledged: number, estimated: number) {
  if (!pledged || !estimated || pledged === 0) {return 1;}
  console.log((pledged / estimated) * 100);
  return (pledged / estimated) * 100;
}

function ProjectCard(props: IProps) {
    return (
       <Card>
          <CardMedia
            image="static/images/cards/circuit.png"
            title="Contemplative Reptile"
          />
          <CardContent>
            <Typography type="headline" component="h2">
              {props.project.title}
            </Typography>
            <Typography component="p">
              {props.project.description}
            </Typography>
            <Typography type="caption">
              Project Size: {props.project.size}
            </Typography>
            {props.project.technologies.map(technology => (
              <Chip key={technology} label={technology} />
            ))}
            <Typography type="caption">
              Current Contributors:
            </Typography>
            <Typography type="caption">
              Open for: days
            </Typography>
            <Typography type="caption">
              Goal: {props.project.estimated} hours
            </Typography>
            <Typography type="caption">
              Pledged: {props.project.pledged} hours
            </Typography>

            <CircularProgress 
              variant="determinate"
              color="secondary"
              size={150}
              value={getPercentage(props.project.pledged!, props.project.estimated!)}
            />

            <div style={styles.row}>
              <Avatar alt="Remy Sharp" src={require("../static/images/cards/uxceo-128.jpg")} />
              <Avatar alt="Remy Sharp" src={require("../static/images/cards/mayer.jpg")} />
              <Avatar alt="Remy Sharp" src={require("../static/images/cards/sheryl.jpg")} />
              <Avatar alt="Remy Sharp" src={require("../static/images/cards/musk.jpeg")} />
            </div>
          </CardContent>
      </Card>
    )
}


export default ProjectCard;