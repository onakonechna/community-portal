import * as React from 'react';
import Typography from '@material-ui/core/Typography';

const styles = {
  padding: '0.5em 1.5em',
  fontSize: '12px',
  backgroundColor: '#F2F3F3',
};

const DescriptionBox = (props: any) => {
  return (
    <Typography component="div" style={styles}>
      {props.children}
    </Typography>
  )
}

export default DescriptionBox;
