import * as React from 'react'
import {withStyles} from "@material-ui/core/styles";
import CardContent from "@material-ui/core/CardContent/CardContent";
import Card from "@material-ui/core/Card/Card";
import UserAvatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';

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
        'margin-right': '30px'
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
                            <Typography className={`${classes.widgetCardText}`}>
                                {displayUser.company}
                            </Typography>
                        </div>
                    </div>
                </CardContent>
            </Card>
        )
    }
}

// @ts-ignore
export default withStyles(styles)(ProfileWidget);
