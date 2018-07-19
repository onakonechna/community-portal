import * as React from 'react';
import Typography from '@material-ui/core/Typography';

const styles = {
    paddingLeft: '24px',
    paddingRight: '24px',
    paddingTop: '6px',
    paddingBottom: '6px',
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
