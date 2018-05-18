import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Card, { CardActions, CardContent, CardMedia } from 'material-ui/Card';
import Button from 'material-ui/Button';
import Typography from 'material-ui/Typography';
import SvgIcon from 'material-ui/SvgIcon';
import green from 'material-ui/colors/green';
import IconButton from 'material-ui/IconButton';
import JoinButtonDialog from './JoinButtonDialog'
import PledgeButtonDialog from './PledgeButtonDialog'

import ProjectProgress from './ProjectProgress';

import Avatar from 'material-ui/Avatar';
import Chip from 'material-ui/Chip';

import GradeIcon from 'material-ui-icons/Grade';
import ShareIcon from 'material-ui-icons/Share';

import Collapse from 'material-ui/transitions/Collapse';
import ExpandMoreIcon from 'material-ui-icons/ExpandMore';
import MoreVertIcon from 'material-ui-icons/MoreVert';

import classnames from 'classnames';
import { CircularProgress } from 'material-ui/Progress';

import Paper from 'material-ui/Paper';
//import CircularProgressbar from 'react-circular-progressbar';

import AddProjetDialog from './AddProjetDialog'
import {Link, LinkProps} from "react-router-dom";
import purple from 'material-ui/colors/purple';

const styles = theme => ({
  button: {
    margin: theme.spacing.unit,
    justifyContent: 'center',
    color: purple
  },
  root: theme.typography.button,
  row: {
    display: 'flex',
    justifyContent: 'center',
  },
  card: {
    maxWidth: 350,
    margin: 30
  },
  media: {
    height: 200,
  },
  avatar: {
    margin: 20
  },
  expand: {
    transform: 'rotate(0deg)',
    // transition: theme.transitions.create('transform', {
    //   duration: theme.transitions.duration.shortest,
    // }),
    marginLeft: 'auto',
  },
  expandOpen: {
    transform: 'rotate(180deg)',
  },
});

const svgStyles = {
  root: {
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'space-around',
    width: '70%',
  },
  iconHover: {
    '&:hover': {
      fill: green[200],
    },
  },
};
const state = {
  completed: 0,
  expanded: false
};

// handleExpandClick = () => {
//   this.setState({ expanded: !this.state.expanded });
// };


function SimpleMediaCard(props) {
  
  const { classes } = props;
  console.log(props)

  var completed;
  if (props.project.pledged > props.project.estimated) {
    completed = <Button color="secondary" className={styles.button}>Project Fulfilled</Button>
  //completed = <div color="secondary" className={props.classes.root}>{"Project Completed"}</div>
  } else {
    completed = "";
  }

  return (
    <div>
      <Card className={classes.card}>
        <CardMedia
          className={classes.media}
          image="static/images/cards/circuit.png"
          title="Contemplative Reptile"
        />
        <CardContent>
        <Typography type="headline" component="h2">
            {props.project.name} {" "}
          </Typography>
          <Typography component="p">
            {props.project.description} {" "}
          </Typography>
          {props.project.technologies.map(function(technology) {
                    return (
                      <Chip label={technology.name} className={classes.chip} />  
                    );
                  })}
         <div style={{display: 'flex', marginTop: 30}} >
         <div>
          <Typography type="caption">
            Project size: {props.project.size}
          </Typography>
          <Typography type="caption">
            Open for: {10} days
          </Typography>
          <Typography type="caption">
            Current contributors: {10}
          </Typography>
          <Typography type="caption">
            Goal: {props.project.estimated} hours
          </Typography>
          <Typography type="caption">
            Pledged: {props.project.pledged} hours
          </Typography>
          </div>
          <div>
          <CircularProgress
            color="secondary"
            size={150}
            mode="determinate"
            value={props.project.pledged}
            min={0.2}
            max={props.project.estimated}
          />
          </div>
        </div>
          

        
      
          
          {/* <ProjectProgress estimated={props.project.estimated} pledged={props.project.pledged} /> */}
          

        <div className={classes.row}>
          <Avatar alt="Remy Sharp" src="static/images/cards/remy.jpg" className={classes.avatar} />
          <Avatar alt="Remy Sharp" src="static/images/cards/uxceo-128.jpg" className={classes.avatar} />
          <Avatar alt="Remy Sharp" src="static/images/cards/uxceo-128.jpg" className={classes.avatar} />
          <Avatar alt="Remy Sharp" src="static/images/cards/uxceo-128.jpg" className={classes.avatar} />
          {/* <Avatar alt="Remy Sharp" src="static/images/cards/uxceo-128.jpg" className={classes.avatar} /> */}
          </div>  
          
          {completed}
        </CardContent>
        <CardActions>
          <Button>View</Button>
          <PledgeButtonDialog handler={props.handler} project={props.project.id} estimated={props.project.estimated} />
          {/* <IconButton aria-label="edit">
            <SvgIcon>
              <path d="M18.824 14.055l-1.555.521.54 1.61c.218.65-.135 1.355-.786 1.574-.15.045-.285.067-.435.063-.511-.015-.976-.338-1.155-.849l-.54-1.607-3.21 1.073.539 1.608c.211.652-.135 1.358-.794 1.575-.15.048-.285.067-.435.064-.51-.015-.976-.34-1.156-.85l-.539-1.619-1.561.524c-.15.045-.285.061-.435.061-.511-.016-.976-.345-1.155-.855-.225-.66.135-1.364.78-1.575l1.56-.525L7.5 11.76l-1.551.525c-.141.048-.285.066-.428.064-.495-.016-.975-.338-1.141-.848-.209-.65.135-1.354.796-1.574l1.56-.52-.54-1.605c-.21-.654.136-1.359.796-1.575.659-.22 1.363.136 1.574.783l.539 1.608L12.3 7.544l-.54-1.605c-.209-.645.135-1.35.789-1.574.652-.211 1.359.135 1.575.791l.54 1.621 1.555-.51c.651-.219 1.356.135 1.575.779.218.654-.135 1.359-.784 1.575l-1.557.524 1.035 3.086 1.551-.516c.652-.211 1.358.135 1.575.795.22.66-.135 1.365-.779 1.574l-.011-.029zm4.171-5.356C20.52.456 16.946-1.471 8.699 1.005.456 3.479-1.471 7.051 1.005 15.301c2.475 8.245 6.046 10.17 14.296 7.694 8.245-2.475 10.17-6.046 7.694-14.296z" />
            </SvgIcon>
          </IconButton> */}
          <a href={props.project.github}>
            <IconButton aria-label="edit" >
              <SvgIcon>
                <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />            
                </SvgIcon>
            </IconButton>
          </a>
          <IconButton aria-label="Add to favorites">
              <GradeIcon />
            </IconButton>
            <IconButton aria-label="Share">
              <ShareIcon />
            </IconButton>
          {/* <IconButton color="primary" aria-label="edit">
            <SvgIcon color="primary" className={svgStyles.iconHover} >
              <path d="M23.954 4.569c-.885.389-1.83.654-2.825.775 1.014-.611 1.794-1.574 2.163-2.723-.951.555-2.005.959-3.127 1.184-.896-.959-2.173-1.559-3.591-1.559-2.717 0-4.92 2.203-4.92 4.917 0 .39.045.765.127 1.124C7.691 8.094 4.066 6.13 1.64 3.161c-.427.722-.666 1.561-.666 2.475 0 1.71.87 3.213 2.188 4.096-.807-.026-1.566-.248-2.228-.616v.061c0 2.385 1.693 4.374 3.946 4.827-.413.111-.849.171-1.296.171-.314 0-.615-.03-.916-.086.631 1.953 2.445 3.377 4.604 3.417-1.68 1.319-3.809 2.105-6.102 2.105-.39 0-.779-.023-1.17-.067 2.189 1.394 4.768 2.209 7.557 2.209 9.054 0 13.999-7.496 13.999-13.986 0-.209 0-.42-.015-.63.961-.689 1.8-1.56 2.46-2.548l-.047-.02z" />
            </SvgIcon>
          </IconButton> */}
          {/* <JoinButtonDialog /> */}
          
          {/* <IconButton
              className={classnames(classes.expand, {
                [classes.expandOpen]: state.expanded,
              })}
              //onClick={this.handleExpandClick}
              aria-expanded={state.expanded}
              aria-label="Show more"
            >
              <ExpandMoreIcon />
            </IconButton> */}
        </CardActions>
        <Collapse in={state.expanded} timeout="auto" unmountOnExit>
            <CardContent>
              <Typography paragraph type="body2">
                Method:
              </Typography>
              <Typography paragraph>
                Heat 1/2 cup of the broth in a pot until simmering, add saffron and set aside for 10
                minutes.
              </Typography>
              <Typography paragraph>
                Heat oil in a (14- to 16-inch) paella pan or a large, deep skillet over medium-high
                heat. Add chicken, shrimp and chorizo, and cook, stirring occasionally until lightly
                browned, 6 to 8 minutes. Transfer shrimp to a large plate and set aside, leaving
                chicken and chorizo in the pan. Add pimentón, bay leaves, garlic, tomatoes, onion,
                salt and pepper, and cook, stirring often until thickened and fragrant, about 10
                minutes. Add saffron broth and remaining 4 1/2 cups chicken broth; bring to a boil.
              </Typography>
              <Typography paragraph>
                Add rice and stir very gently to distribute. Top with artichokes and peppers, and
                cook without stirring, until most of the liquid is absorbed, 15 to 18 minutes.
                Reduce heat to medium-low, add reserved shrimp and mussels, tucking them down into
                the rice, and cook again without stirring, until mussels have opened and rice is
                just tender, 5 to 7 minutes more. (Discard any mussels that don’t open.)
              </Typography>
              <Typography>
                Set aside off of the heat to let rest for 10 minutes, and then serve.
              </Typography>
            </CardContent>
          </Collapse>
      </Card>
    </div>
  );
}

SimpleMediaCard.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(SimpleMediaCard);