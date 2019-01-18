import * as React from 'react'
import {withStyles} from "@material-ui/core/styles";
import CardContent from "@material-ui/core/CardContent/CardContent";
import Card from "@material-ui/core/Card/Card";
import UserAvatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import LocationIcon from '@material-ui/icons/LocationOn';
import MailIcon from '@material-ui/icons/MailOutline';
import LinkIcon from '@material-ui/icons/Link';

const styles = () => ({
    widgetCard: {
        'background': '#fff',
        'display': 'inline-block',
        'font-family': 'system-ui',
        'color': '#6b6868',
        'font-size': '14px',
        'margin': '10px',
        'width': '600px',
				'min-width': '530px',
			  ['@media (max-width: 1520px)']: {
            'width': '800px'
        }
    },
    'width50': {
        'width': '50%'
    },
    'width100': {
        'width': '100%'
    },
    'width30': {
        'width': '30%'
    },
    'width70': {
        'width': '70%'
    },
    'containers': {
        'display': 'inline-block',
        'vertical-align': 'top',
        'margin-right': '30px',
        'max-width': '290px'
    },
    'avatarBlock': {
        'width': '200px',
        'height': 'auto'
    },
    widgetCardTitle: {
        'font-size': '16px',
        'display': 'inline-block',
        'color': '#6b6868',
        'font-family': 'system-ui',
        'font-weight': 'bold'
    },
    widgetCardText: {
        'font-size': '14px',
        'font-family': 'system-ui',
        'color': '#6b6868',
        'display': 'flex'
    },
	  informationContainer: {
        'margin': '15px 0'
    },
	  iconWrapper: {
        'display': 'inline-block'
    },
    informationWrapper: {
			  'margin': '0 10px',
        'display': 'inline-block'
    }
});

// @ts-ignore
class ProfileWidget extends React.Component {
    render() {
        // @ts-ignore
        const displayUser = this.props.displayUser || {};
        // @ts-ignore
        const classes = this.props.classes || {};

        return (
            <Card className={classes.widgetCard}>
                <CardContent>
                    <div className={classes.width100}>
                        <div className={`${classes.containers}`}>
                            <UserAvatar className={`${classes.avatarBlock}`} src={displayUser.avatar_url} />
                        </div>
                        <div className={`${classes.containers}`}>
                            <Typography className={`${classes.widgetCardTitle}`}>
                                {displayUser.name}
                            </Typography>
                            <div className={classes.informationContainer}>
                                {   displayUser.company &&
                                    <Typography className={`${classes.widgetCardText}`}>
                                        {displayUser.company}
                                    </Typography>
                                }
                                {
																	  displayUser.bio &&
                                    <Typography className={`${classes.widgetCardText}`}>
                                        {displayUser.bio}
                                    </Typography>
                                }
                                <div className={classes.informationContainer}>
                                    { displayUser.location &&
                                        <Typography className={`${classes.widgetCardText}`}>
                                            <span className={classes.iconWrapper}><LocationIcon/></span>
                                            <span className={classes.informationWrapper}>{displayUser.location}</span>
                                        </Typography>
																		}
																		{displayUser.email &&
                                        <Typography className={`${classes.widgetCardText}`}>
                                            <span className={classes.iconWrapper}><MailIcon/></span>
                                            <span className={classes.informationWrapper}>{displayUser.email}</span>
                                        </Typography>
																		}
                                    {displayUser.blog &&
                                        <Typography className={`${classes.widgetCardText}`}>
                                            <span className={classes.iconWrapper}><LinkIcon/></span>
                                            <span className={classes.informationWrapper}>{displayUser.blog.replace(/\\/g, '')}</span>
                                        </Typography>
																		}
																</div>
														</div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        )
    }
}

// @ts-ignore
export default withStyles(styles)(ProfileWidget);
