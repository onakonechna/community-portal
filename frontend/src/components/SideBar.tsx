import * as React from 'react';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { withStyles } from '@material-ui/core/styles';
import PartnersSideBarBlock from './partners/layout/SideBar';

const styles = {
  list: {
    width: '15rem',
  },
  listItem: {
    'text-align': 'center',
    'font-family': 'system-ui',
  },
  homeIcon: {
    'margin-left': 'auto',
    'margin-right': 'auto',
  },
};

const SideBar = (props: any) => {
  const { classes, open, toggleSideBar } = props;
  const sideList = (
    <div className={classes.list}>
      <List component="nav">
        <ListItem
          button
          className={classes.listItem}
          onClick={props.toProfile}
        >
          <ListItemText primary="Profile" />
        </ListItem>
        <Divider />
        <ListItem
          button
          className={classes.listItem}
          onClick={props.toBookMark}
        >
          <ListItemText primary="Bookmarked Projects" />
        </ListItem>
        <Divider />
        <ListItem
          button
          className={classes.listItem}
          onClick={props.toPledged}
        >
          <ListItemText primary="Joined Projects" />
        </ListItem>
        <Divider/>
        <PartnersSideBarBlock/>
      </List>
    </div>
  );

  return (
    <Drawer open={open} onClose={toggleSideBar} anchor="left">
      <div
        tabIndex={0}
        role="button"
        onClick={toggleSideBar}
        onKeyDown={toggleSideBar}
      >
        {sideList}
      </div>
    </Drawer>
  );
};

export default withStyles(styles)(SideBar);
