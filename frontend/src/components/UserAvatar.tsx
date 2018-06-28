import * as React from 'react';
import Avatar from '@material-ui/core/Avatar';

const UserAvatar = (props: any) => (
    <Avatar src={props.user.avatar_url} />
);

export default UserAvatar;
