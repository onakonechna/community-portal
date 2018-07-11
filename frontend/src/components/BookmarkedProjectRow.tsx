import * as React from 'react';

import Chip from '@material-ui/core/Chip';

interface BookmarkProjectRowProps {
  project_id: string;
  name: string;
  handler: any;
}

const BookmarkedProjectRow = (props: BookmarkProjectRowProps) => {
  return (
    <Chip
      key={props.project_id}
      label={props.name}
      onClick={props.handler}
      style={{
        margin: '1.5rem 1rem 1rem 0',
        borderRadius: '5px',
      }}
    />
  );
};

export default BookmarkedProjectRow;
