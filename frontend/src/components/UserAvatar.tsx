import * as React from 'react';
import Avatar from '@material-ui/core/Avatar';
import { withStyles } from '@material-ui/core/styles';

const styles = (theme: any) => ({
  avatar: {
    [theme.breakpoints.down('sm')]: {
      display: 'none',
    },
  },
})

const UserAvatar = (props: any) => (
  <Avatar className={props.classes.avatar} src={props.user.avatar_url} />
);

export default withStyles(styles)(UserAvatar);
