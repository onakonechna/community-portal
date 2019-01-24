import * as React from 'react';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { withStyles } from '@material-ui/core/styles';
import PartnersSideBarBlock from './partners/layout/SideBar';
import AccountBox from '@material-ui/icons/AccountBox';
import CollectionsBookmark from '@material-ui/icons/CollectionsBookmark';
import LibraryBooks from '@material-ui/icons/LibraryBooks';
import Event from '@material-ui/icons/Event';

const styles = {
    list: {
        width: '15rem',
    },
    listItem: {
        'text-align': 'left',
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
                    <AccountBox/>
                    <ListItemText primary="Profile" />
                </ListItem>
                <Divider />
                <ListItem
                    button
                    className={classes.listItem}
                    onClick={props.toBookMark}
                >
                    <CollectionsBookmark/>
                    <ListItemText primary="Bookmarked Projects" />
                </ListItem>
                <Divider />
                <ListItem
                    button
                    className={classes.listItem}
                    onClick={props.toProjects}
                >
                    <LibraryBooks/>
                    <ListItemText primary="Joined Projects" />
                </ListItem>
                <Divider/>
                <ListItem
                    button
                    className={classes.listItem}
                    onClick={props.toCalendar}
                >
                    <Event/>
                    <ListItemText primary="Community Calendar" />
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
