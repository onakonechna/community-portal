import * as React from 'react';
import Avatar from '@material-ui/core/Avatar';

interface ContributorAvatarProps {
  avatar_url: string;
}

const ContributorAvatar = (props:ContributorAvatarProps) => {
  return (
    <Avatar src={props.avatar_url}></Avatar>
  );
};

export default ContributorAvatar;
