import * as React from 'react';
import Typography from '@material-ui/core/Typography';

const styles = {
  padding: '6px 24px',
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
