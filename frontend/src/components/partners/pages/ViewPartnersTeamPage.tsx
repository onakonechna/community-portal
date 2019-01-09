import * as React from 'react';
import { withStyles } from '@material-ui/core/styles';
import * as _ from 'lodash';
import { getPartnerTeam } from '../../../actions/partners';
import { connect } from "react-redux";
import { addMessage } from "../../../actions/messages";
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import classnames from "classnames";
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import HighlightOff from '@material-ui/icons/HighlightOff';
import green from "@material-ui/core/colors/green";

const styles = (theme: any) => ({
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
        margin: '5px 0'
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
        margin: '0 45px'
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
    },
    'container': {
        'width': '80%',
        'max-width': '600px',
        'margin': '30px auto',
        'font-family': 'Arial, sans-serif',
        'background': '#fbfbfb',
        'box-shadow': '0px 0px 3px 0px rgba(0, 0, 0, 0.3)',
        'padding': '20px',
        'box-sizing': 'border-box'
    },
    'logo': {
        'max-width': '400px',
        'display': 'block',
        'margin': '0 auto',
        'box-shadow': '0px 0px 3px 0px rgba(0, 0, 0, 0.3)'
    },
    'headerContainer': {
        'text-align': 'center'
    },
    'name': {
        'font-size': '28px',
        'color': '#24292e',
        'text-decoration': 'none',
        'text-transform': 'uppercase'
    },
    'title': {
        'padding': '25px 30px',
        'box-sizing': 'border-box'
    },
    'headline': {
        margin: '25px 0'
    },
    'headlineContent': {
        margin: '10px 0'
    },
    'membersWrapper': {
        margin: '0 25px'
    },
    'description': {
        'text-align': 'center'
    },
    'memberWrapper': {
        background: '#ececec',
        padding: '5px 20px',
        'border-radius': '3px',
        'margin-bottom': '20px',
        'box-shadow': '0px 0px 3px 0px rgba(0, 0, 0, 0.3)'
    }
});

class ViewPartnersTeamPage extends React.Component<any, any> {
    constructor(props: any) {
        super(props);

        this.state = {
            name: '',
            logo: '',
            githubTeamName: '',
            description: '',
            owner: {login: '', id: ''},
            owners: [],
            member: {login:'', id: ''},
            members: [],
            allowedDomain: '',
            allowedDomains: [],
            id: ''
        };

        this.props.getPartnerTeam(props.match.params.id)
            .then((response:any) => {
                if (response.error) {
                    this.props.addMessage({
                        type: 'error',
                        massage: response.message
                    })
                }
                const {name, avatar_url, members} = response.data;
                this.setState({name, avatar_url, members});
            });
    }

    // handleChipsDelete = (collectionName: string) => (name: string) => this.setState({
    //     [collectionName]: _.without(this.state[collectionName], name)
    // });


    // handleAddButtonClick = (name: string, collectionName: string) => () => {
    //     if (this.state[name]) {
    //         this.setState({
    //             [collectionName]: [...this.state[collectionName], this.state[name]],
    //             [name]: ''
    //         })
    //     }
    // };
    //
    // handleChange = (name: string) => (event: any) => {
    //     this.setState({
    //         [name]: event.target.value,
    //     });
    // };

    isPartnerAdmin = (user:any) => {
        let isAdmin = false;
        user.scopes.map(function (value: any, index: any) {
            if (value.scope == 'partners_admin') {
                isAdmin = true;
            }
        });
        return isAdmin;
    };
    isPartnerMember = (user:any) => {
        let isMember = false;
        user.scopes.map(function (value: any, index: any) {
            if (value.scope == 'partner_team_member') {
                isMember = true;
            }
        });
        return isMember;
    };

    isPartnerOwner = (user:any) => {
        let isOwner = false;
        user.scopes.map(function (value: any, index: any) {
            if (value.scope == 'partner_team_owner') {
                isOwner = true;
            }
        });
        return isOwner;
    };

    isPartnerUser = (user:any) => this.isPartnerOwner(user) || this.isPartnerMember(user);

    getEmailVerificationStatus = (user:any) => {
        let verificationStatus = null;

        if (this.isPartnerAdmin(user)) {
            return <CheckCircleIcon className={this.props.classes.success}/>;
        }

        this.getMembershipTeamData(user).map(function (value: any, index: any) {
            if (value.code == 'email_verified') {
                verificationStatus = value.value;
            }
        });

        if (verificationStatus === null) {
            return <Typography className={this.props.classes.displayTableTypography}>N/A</Typography>
        }

        return verificationStatus ?
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
        if (this.isPartnerMember(user) || this.isPartnerOwner(user)) {
            return user.attributes;
        }

        return {}
    };
    getMembershipStatus = (user:any) => {
        let status = 'unverified';
        this.getMembershipTeamData(user).map(function (value: any, index: any) {
            if (value.code == 'status') {
                status = value.value;
            }
        });

        return status;
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

    getTwoFactorAuthenticationStatus = (user:any) => {
        if (_.isUndefined(user.two_factor_authentication)) {
            return <Typography className={this.props.classes.displayTableTypography}>N/A</Typography>
        }

        return user.two_factor_authentication ?
            <CheckCircleIcon className={this.props.classes.success}/> :
            <HighlightOff className={this.props.classes.error}/>
    };

    // onSubmit = (e: any) => {
    //     e.preventDefault();
    //
    //     const data = {
    //         name: this.state.name,
    //         avatar_url: this.state.avatar_url,
    //         githubUrl: this.state.githubUrl,
    //         description: this.state.description,
    //         owners: this.state.owners || [],
    //         members: this.state.members || [],
    //         allowedDomains: this.state.allowedDomains
    //     };
    //
    //     this.props.saveTeam(data)
    //         .then((data:any) => {
    //             this.props.history.push('/partners-management');
    //         });
    // };

    public render() {
        return (
            <div className={this.props.classes.container}>
                <div className={this.props.classes.headerContainer}>
                    {
                        this.state.avatar_url && (
                            <div>
                                <img alt={this.state.name} className={this.props.classes.logo} src={this.state.avatar_url}/>
                            </div>
                        )
                    }
                    <div className={this.props.classes.title}>
                        <a href={`https://github.com/orgs/magento/teams/${this.state.githubTeamName}`} className={this.props.classes.name}>{this.state.name}</a>
                    </div>
                </div>
                <div className={this.props.classes.description}>
                    <span>{this.state.description}</span>
                </div>
                <div className={this.props.classes.membersWrapper}>
                    <div className={this.props.classes.headline}>
                        <Divider/>
                        <Typography variant="headline" className={this.props.classes.headlineContent}>
                            Members:
                        </Typography>
                        <Divider/>
                    </div>
                    {this.state.members && this.state.members.map((user:any, key:any) => (
                        <div key={key} className={this.props.classes.memberWrapper}>
                            <div className={this.props.classes.partnersBlock}>
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
                                                        {user.login}
                                                    </Typography>
                                                </div>
                                            </div>
                                        </div>
                                        {
                                            this.isPartnerUser(user) && (
                                                <div className={this.props.classes.displayTableRow}>
                                                    <div className={this.props.classes.displayTableColumn}>
                                                        <Typography className={classnames(this.props.classes.displayTableTypography, this.props.classes.fontWeight)}>Email:</Typography>
                                                    </div>
                                                    <div className={this.props.classes.displayTableColumn}>
                                                        <div className={this.props.classes.displayTableStatus}>
                                                            <Typography className={this.props.classes.displayTableTypography}>
                                                                {(<span key={key}>{user.email}</span>)}
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
                                                        {this.getUserRole(user)}
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
                                                    {this.getEmailVerificationStatus(user)}
                                                </div>
                                            </div>
                                        </div>
                                        <div className={this.props.classes.displayTableRow}>
                                            <div className={this.props.classes.displayTableColumn}>
                                                <Typography className={this.props.classes.displayTableTypography}>Two Factor Authentication:</Typography>
                                            </div>
                                            <div className={this.props.classes.displayTableColumn}>
                                                <div className={this.props.classes.displayTableStatus}>
                                                    {this.getTwoFactorAuthenticationStatus(user)}
                                                </div>
                                            </div>
                                        </div>
                                        {
                                            this.isPartnerUser(user) && (
                                                <div className={this.props.classes.displayTableRow}>
                                                    <div className={this.props.classes.displayTableColumn}>
                                                        <Typography className={this.props.classes.displayTableTypography}>Membership status:</Typography>
                                                    </div>
                                                    <div className={this.props.classes.displayTableColumn}>
                                                        <div className={this.props.classes.displayTableStatus}>
                                                            <Typography className={this.props.classes.displayTableTypography}>
                                                                {this.getMembershipStatusMap(this.getMembershipStatus(user))}
                                                            </Typography>
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }
}

export default connect<any>(null, {
    getPartnerTeam,
    addMessage
})(withStyles(styles)(ViewPartnersTeamPage));
