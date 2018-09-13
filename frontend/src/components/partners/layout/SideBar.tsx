import * as React from 'react';
import {connect} from "react-redux";
import * as _ from 'lodash';
import { withStyles } from '@material-ui/core/styles';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import { withRouter } from 'react-router-dom';
import Assignment from '@material-ui/icons/Assignment';
import NoteAdd from '@material-ui/icons/NoteAdd';
import Pageview from '@material-ui/icons/Pageview';
import DeveloperBoard from '@material-ui/icons/DeveloperBoard';

const styles = {
  center: {
    "text-align": "left"
  },
};

class SideBar extends React.Component<any, any> {
  isPartnerAdmin = (user:any) => user['partners_admin'];
  isPartnerMember = (user:any) => !_.isEmpty(this.getUserIsMemberTeams(user));
  isPartnerOwner = (user:any) => !_.isEmpty(this.getUserIsOwnerTeams(user));
  isPartnerUser = (user:any) => this.isPartnerOwner(user) || this.isPartnerMember(user);
  getUserIsMemberTeams = (user:any) => user['partner_team_member'];
  getUserIsOwnerTeams = (user:any) => user['partner_team_owner'];
  getPartnerAdminBlock = (props:any) => {
    if (this.isPartnerAdmin(props.user)) {
      return (
        <div>
          <ListItem button className={props.classes.center} onClick={this.toPartnerTeams}>
            <Assignment/>
            <ListItemText primary="Partner Teams" />
          </ListItem>
          <Divider />
          <ListItem button className={props.classes.center} onClick={this.toCreatePartnerTeam}>
            <NoteAdd/>
            <ListItemText primary="Create Partner Team" />
          </ListItem>
          <Divider />
        </div>
      );
    }

    return null;
  };
  getPartnerMemberBlock = (props:any) => {
    if (this.isPartnerUser(props.user)) {
      return (
        <div>
          <ListItem button className={props.classes.center} onClick={this.toViewPartnerTeam}>
            <Pageview/>
            <ListItemText primary="View Partner Team" />
          </ListItem>
          <Divider />
        </div>
      );
    }

    return null;
  };
  getPartnerOwnerBlock = (props:any) => {
    if (this.isPartnerOwner(props.user)) {
      return (
        <div>
          <ListItem button className={props.classes.center} onClick={this.toEditPartnerTeam}>
            <DeveloperBoard/>
            <ListItemText primary="Edit Partner Team" />
          </ListItem>
          <Divider />
        </div>
      );
    }

    return null;
  };
  toPartnerTeams = () => this.props.history.push('/partners-management');
  toCreatePartnerTeam = () => this.props.history.push('/partners-management/create');
  toViewPartnerTeam = () => this.props.history.push(
    `/partners-management/view/${this.getUserIsMemberTeams(this.props.user)['team_id'] ||
    this.getUserIsOwnerTeams(this.props.user)['team_id']}`
  );
  toEditPartnerTeam = () => this.props.history.push(
    `/partners-management/edit/${this.getUserIsOwnerTeams(this.props.user)['team_id']}`
  );

  render() {
    if (this.isPartnerAdmin(this.props.user) || this.isPartnerUser(this.props.user)) {
      return (
        <div>
          {this.getPartnerAdminBlock(this.props)}
          {this.getPartnerMemberBlock(this.props)}
          {this.getPartnerOwnerBlock(this.props)}
        </div>
      )
    }

    return null;
  }
}

const mapStateToProps = (state:any) => ({
  user: state.user || {}
});

export default withRouter(connect<any, any, any>(mapStateToProps, {})(withStyles(styles)(SideBar)));
