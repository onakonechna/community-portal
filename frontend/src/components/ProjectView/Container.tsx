import * as React from 'react';
import Typography from '@material-ui/core/Typography';

const Container = (props: any) => {
  return (
    <Typography component="div" style={{ padding: 8 * 3 }}>
      {props.children}
    </Typography>
  );
};

export default Container;
