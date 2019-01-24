import * as React from 'react';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import SignInIcon from '@material-ui/icons/AccountCircle';
import withStyles from '@material-ui/core/styles/withStyles';
import UserAvatar from '../UserAvatar';
import withAuth from '../WithAuth';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

const Avatar = withAuth(['user'])(UserAvatar);

const retrieveFirstName = (name: string) => {
    return name ? name.split(' ')[0] : 'User';
};

const styles = (theme:any) => ({
    authWrapper: {
        display: 'flex',
        'align-items': 'center',
    },
    logoutButton: {
        'font-size': '1rem',
    },
    signInIcon: {
        'margin-right': '0.5rem',
    },
    signInText: {
        'font-size': '0.8rem',
        [theme.breakpoints.down('md')]: {
            padding: '8px 0.2rem',
        },
        'min-width': '0',
    },
    welcomeText: {
        'font-size': '1rem',
        margin: '0 1rem 0.2rem 0',
        [theme.breakpoints.down('sm')]: {
            display: 'none',
        },
    },
});

class LoginButton extends React.Component<any & any, any> {

    constructor(props: any & any) {
        super(props);

        this.state = {
            anchorEl: null,
        };
    }

    handleClick = (event:any) => {
        this.setState({ anchorEl: event.currentTarget });
    };

    handleClose = () => {
        this.setState({ anchorEl: null });
    };

    render() {
        const props = this.props;
        const { anchorEl } = this.state;
        const { classes } = this.props;

        return (
            <div>
                { props.user.id
                    ?
                    <div className={classes.authWrapper}>
                        <Button className={classes.logoutButton} onClick={props.logoutHandler}>Logout</Button>
                        <Typography className={classes.welcomeText}>{`Welcome, ${retrieveFirstName(props.user.name)}`}</Typography>
                        <Avatar />
                    </div>
                    : (<div>
                        <Button id={'login'} className={classes.signInText} onClick={this.handleClick}>
                            <SignInIcon key={'signin'} className={classes.signInIcon}/>
                            <Typography className={classes.welcomeText}>Sign In</Typography>
                        </Button>
                        <Menu
                            id="login-menu"
                            anchorEl={anchorEl}
                            open={Boolean(anchorEl)}
                            onClick={this.handleClose}
                        >
                            <MenuItem onClick={(e) => {
                                props.handler('contributor');
                            }}>As Contributor</MenuItem>
                            <MenuItem onClick={(e) => {
                                props.handler('partner');
                            }}>As Partner</MenuItem>
                        </Menu>
                    </div>)
                }
            </div>
        );
    }
}

export default withStyles(styles)(LoginButton);
