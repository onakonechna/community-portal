import * as React from 'react';
import {connect} from "react-redux";
import * as _ from 'lodash';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { withRouter } from 'react-router-dom';
import Divider from '@material-ui/core/Divider';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import HighlightOff from '@material-ui/icons/HighlightOff';
import green from "@material-ui/core/colors/green";
import classnames from "classnames";
import Button from '@material-ui/core/Button';
import { verifyPartnerUser } from '../../../actions/partners';
import { addMessage } from '../../../actions/messages';
import { LoadUserAction } from '../../../actions';
import {decode} from "jsonwebtoken";


const styles = (theme:any) => ({
  center: {
    "text-align": "center"
  },
  success: {
    fill: green[600],
  },
  error: {
    fill: theme.palette.error.dark,
  },
  partnersBlock: {
    margin: '20px 0'
  },
  header: {
    padding: '10px 0'
  },
  subheading: {
    padding: '10px 0',
    'font-weight': 'bold'
  },
  displayTable: {
    display: 'table'
  },
  displayTableRow: {
    display: 'table-row'
  },
  displayTableColumn: {
    display: 'table-cell'
  },
  displayTableTypography: {
    'vertical-align': 'text-bottom',
    'line-height': '28px',
    'display': 'inline-block'
  },
  displayTableStatus: {
    margin: '0 15px'
  },
  subheadingBlock: {
    margin: '10px 0'
  },
  lineHeight: {
    'line-height': '28px'
  },
  fullWidth: {
    width: '100%'
  },
  acceptInvitationBtn: {
    'text-decoration': 'none'
  },
  waitingColor: {
    'color': '#c1c127'
  },
  acceptColor: {
    'color': '#1c751d'
  },
  fontWeight: {
    'font-weight': '600'
  }
});

class Profile extends React.Component<any, any> {
  isPartnerAdmin = (user:any) => user['partners_admin'];
  isPartnerMember = (user:any) => !_.isEmpty(this.getUserIsMemberTeams(user));
  isPartnerOwner = (user:any) => !_.isEmpty(this.getUserIsOwnerTeams(user));
  isPartnerUser = (user:any) => this.isPartnerOwner(user) || this.isPartnerMember(user);
  getUserIsMemberTeams = (user:any) => user['partner_team_member'];
  getUserIsOwnerTeams = (user:any) => user['partner_team_owner'];
  isPartner = (user:any) => this.isPartnerAdmin(user) || this.isPartnerUser(user);
  getEmailVerificationStatus = (user:any) => {
    if (this.isPartnerAdmin(user)) {
      return <CheckCircleIcon className={this.props.classes.success}/>;
    }

    return this.getMembershipTeamData(user).emailVerified ?
      <CheckCircleIcon className={this.props.classes.success}/> :
      <HighlightOff className={this.props.classes.error}/>;
  };
  getMembershipStatusMap = (status:string) => {
    if (status === 'unverified') {
      return <span className={this.props.classes.waitingColor}>Waiting verification</span>
    } else if (status === 'pending') {
      return <span className={this.props.classes.waitingColor}>Waiting accepting of invitation</span>
    } else if (status === 'active') {
      return <span className={this.props.classes.acceptColor}>Active</span>
    }

    return '';
  };
  getMembershipTeamData = (user:any) => {
    if (this.isPartnerMember(user)) {
      return this.getUserIsMemberTeams(user);
    }

    if (this.isPartnerOwner(user)) {
      return this.getUserIsOwnerTeams(user);
    }

    return {}
  };
  getMembershipStatus = (user:any) => {
    return this.getMembershipTeamData(user).status;
  };
  getUserRole = (user:any) => {
    if (this.isPartnerAdmin(user)) {
      return "Administrator";
    }

    if (this.isPartnerOwner(user)) {
      return "Team owner";
    }

    if (this.isPartnerMember(user)) {
      return "Team member";
    }

    return '';
  };
  verifyButtonHandler = () => {
    this.props.verifyPartnerUser(this.props.user['id'])
      .then((data:any) => {
        if (data.payload.error) {
          this.props.addMessage({
            type: 'error',
            message: data.payload.message
          })
        } else {
          this.props.LoadUserAction(decode(data.data));
          localStorage.setItem('oAuth', JSON.stringify(data.data))
        }
      })
  };

  render() {
    if (this.isPartner(this.props.user)) {
      return (
        <div className={this.props.classes.partnersBlock}>
          <Divider/>
            <Typography variant="headline" className={this.props.classes.header}>
              Partner section:
            </Typography>
          <Divider/>
          <div >
            <Typography variant="subheading" className={this.props.classes.subheading}>
              Information:
            </Typography>
            <Divider/>
            <div className={classnames(this.props.classes.displayTable, this.props.classes.subheadingBlock)}>
              <div className={this.props.classes.displayTableRow}>
                <div className={this.props.classes.displayTableColumn}>
                  <Typography className={classnames(this.props.classes.displayTableTypography, this.props.classes.fontWeight)}>GitHub Login:</Typography>
                </div>
                <div className={this.props.classes.displayTableColumn}>
                  <div className={this.props.classes.displayTableStatus}>
                    <Typography className={this.props.classes.displayTableTypography}>
                      {this.props.user.login}
                    </Typography>
                  </div>
                </div>
              </div>
              {
                this.isPartnerUser(this.props.user) && (
                    <div className={this.props.classes.displayTableRow}>
                      <div className={this.props.classes.displayTableColumn}>
                        <Typography className={classnames(this.props.classes.displayTableTypography, this.props.classes.fontWeight)}>Partner team name:</Typography>
                      </div>
                      <div className={this.props.classes.displayTableColumn}>
                        <div className={this.props.classes.displayTableStatus}>
                          <Typography className={this.props.classes.displayTableTypography}>
                            {this.getMembershipTeamData(this.props.user).team_id}
                          </Typography>
                        </div>
                      </div>
                    </div>
                )
              }
              {
                this.isPartnerUser(this.props.user) && (
                  <div className={this.props.classes.displayTableRow}>
                    <div className={this.props.classes.displayTableColumn}>
                      <Typography className={classnames(this.props.classes.displayTableTypography, this.props.classes.fontWeight)}>Partner team name on GitHub:</Typography>
                    </div>
                    <div className={this.props.classes.displayTableColumn}>
                      <div className={this.props.classes.displayTableStatus}>
                        <Typography className={this.props.classes.displayTableTypography}>
                          {this.getMembershipTeamData(this.props.user).github_team_name}
                        </Typography>
                      </div>
                    </div>
                  </div>
                )
              }
              <div className={this.props.classes.displayTableRow}>
                <div className={this.props.classes.displayTableColumn}>
                  <Typography className={classnames(this.props.classes.displayTableTypography, this.props.classes.fontWeight)}>Role:</Typography>
                </div>
                <div className={this.props.classes.displayTableColumn}>
                  <div className={this.props.classes.displayTableStatus}>
                    <Typography className={this.props.classes.displayTableTypography}>
                      {this.getUserRole(this.props.user)}
                    </Typography>
                  </div>
                </div>
              </div>
            </div>
            <Divider/>
          </div>
          <div>
            <Typography variant="subheading" className={this.props.classes.subheading}>
              Verification:
            </Typography>
            <Divider/>
            <div className={classnames(this.props.classes.displayTable, this.props.classes.subheadingBlock)}>
              <div className={this.props.classes.displayTableRow}>
                <div className={this.props.classes.displayTableColumn}>
                  <Typography className={this.props.classes.displayTableTypography}>Email status:</Typography>
                </div>
                <div className={this.props.classes.displayTableColumn}>
                  <div className={this.props.classes.displayTableStatus}>
                    {this.getEmailVerificationStatus(this.props.user)}
                  </div>
                </div>
              </div>
              <div className={this.props.classes.displayTableRow}>
                <div className={this.props.classes.displayTableColumn}>
                  <Typography className={this.props.classes.displayTableTypography}>Two Factor Authentication:</Typography>
                </div>
                <div className={this.props.classes.displayTableColumn}>
                  <div className={this.props.classes.displayTableStatus}>
                    {this.props.user.two_factor_authentication ?
                      <CheckCircleIcon className={this.props.classes.success}/> :
                      <HighlightOff className={this.props.classes.error}/>
                    }
                  </div>
                </div>
              </div>
              {
                this.isPartnerUser(this.props.user) && (
                  <div className={this.props.classes.displayTableRow}>
                    <div className={this.props.classes.displayTableColumn}>
                      <Typography className={this.props.classes.displayTableTypography}>Membership status:</Typography>
                    </div>
                    <div className={this.props.classes.displayTableColumn}>
                      <div className={this.props.classes.displayTableStatus}>
                        <Typography className={this.props.classes.displayTableTypography}>
                        {this.getMembershipStatusMap(this.getMembershipStatus(this.props.user))}
                        </Typography>
                      </div>
                    </div>
                  </div>
                )
              }
            </div>
            {
              this.isPartnerUser(this.props.user) && this.getMembershipStatus(this.props.user) === 'unverified' && (
                <div>
                  <Button variant="contained" color="primary" onClick={this.verifyButtonHandler} className={this.props.classes.fullWidth}>
                    Verify and send invitation to Partner team
                  </Button>
                </div>
              )
            }
            {
              this.isPartnerUser(this.props.user) && this.getMembershipStatus(this.props.user) === 'pending' && (
                <div>
                  <a href="https://github.com/magento" target="_blank" className={this.props.classes.acceptInvitationBtn}>
                    <Button variant="contained" color="primary" className={this.props.classes.fullWidth}>
                      Accept Partner team invitation
                    </Button>
                  </a>
                </div>
              )
            }
          </div>
        </div>
      )
    }

    return null;
  }
}

const mapStateToProps = (state:any) => ({
  user: state.user || {}
});

export default withRouter(connect<any, any, any>(mapStateToProps, {verifyPartnerUser, addMessage, LoadUserAction})(withStyles(styles)(Profile)));
