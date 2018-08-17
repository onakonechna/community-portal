import * as React from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';
import * as _ from 'lodash';
import FieldWithChips from '../lib/FieldWithChips';
import {getPartnerTeam, editTeam} from '../../../actions/partners';
import {addMessage} from '../../../actions/messages';
import { connect } from "react-redux";
import { Link } from 'react-router-dom';

const styles = (theme: any) => ({
  'container': {
    'width': '60%',
    'margin': '0 auto'
  },
  'fields': {
    'width': '100%'
  },
  'notice': {
    margin: '20px 0',
    background: '#ffffb0',
    padding: '20px',
    'line-height': '22px',
    'font-family': 'system-ui',
    color: 'gray',
    'border-radius': '6px'
  },
  'link': {
    color: '#9e9e9e',
    'font-weight': '600'
  }
});

class EditPartnersTeamPage extends React.Component<any, any> {
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
        if (response.payload.error) {
          this.props.addMessage({
            type: 'error',
            massage: response.payload.message
          })
        }

        const {name, logo, githubTeamName, description, owners, members, allowedDomains, id} = response.payload.data;
        this.setState({name, logo, githubTeamName, description, owners, members, allowedDomains, id});
      })
  }

  handleChipsObjectDelete = (collectionName: string) => (chips: any) => this.setState({
    [collectionName]: _.filter(this.state[collectionName], (item:any) => item.login !== chips.login)
  });

  handleChipsDelete = (collectionName: string) => (name: string) => this.setState({
    [collectionName]: _.without(this.state[collectionName], name)
  });

  handleAddButtonClick = (name: string, collectionName: string) => () => {
    if (this.state[name]) {
      this.setState({
        [collectionName]: [...this.state[collectionName], this.state[name]],
        [name]: ''
      })
    }
  };

  handleAddButtonObjectClick = (name: string, collectionName: string, property:any) => () => {
    if (this.state[name][property]) {
      this.setState({
        [collectionName]: [...this.state[collectionName], this.state[name]],
        [name]: {[property]: ''}
      })
    }
  };

  handleChangeObject = (name:string, property:string) => (event:any) => {
    this.setState({
      [name]: {[property]: event.target.value}
    })
  };

  handleChange = (name: string) => (event: any) => {
    this.setState({
      [name]: event.target.value,
    });
  };

  onSubmit = (e: any) => {
    e.preventDefault();
    let data:any;

    if (this.isPartnerOwner(this.props.user)) {
      data = {
        logo: this.state.logo,
        description: this.state.description,
        members: this.state.members,
        id: this.state.name.toLowerCase().replace(' ', '-')
      }
    }

    if (this.isPartnerAdmin(this.props.user)) {
      data = {
        name: this.state.name,
        logo: this.state.logo,
        isNewTeam: this.state.isNewTeam,
        githubTeamName: this.state.githubTeamName,
        description: this.state.description,
        owners: this.state.owners,
        members: this.state.members,
        allowedDomains: this.state.allowedDomains,
        id: this.state.name.toLowerCase().replace(' ', '-')
      }
    }

    this.props.editTeam(data)
      .then((data:any) => {
        if (!data.payload.error) {
          this.props.history.push('/partners-management');
          this.props.addMessage({
            type: 'success',
            massage: 'Team was successfully updated'
          })
        } else {
          this.props.addMessage({
            type: 'error',
            massage: data.payload.message
          })
        }
      });
  };

  isPartnerAdmin = (user:any) => user['partners_admin'];
  getUserIsOwnerTeams = (user:any) => user['partner_team_owner'];
  isPartnerOwnerActive = (user:any) => this.getUserIsOwnerTeams(user).status === 'active';
  isPartnerOwner = (user:any) => !_.isEmpty(this.getUserIsOwnerTeams(user));

  public render() {
    return (
      <div className={this.props.classes.container}>
        {
          !this.isPartnerOwnerActive(this.props.user) && !this.isPartnerAdmin(this.props.user) && (
            <div className={this.props.classes.notice}>
              {`You was added as owner of the "${this.state.name}" team,
              but currently your account is inactive. Please check your account status in the your `
              }
              <Link to={'/profile'} className={this.props.classes.link}>profile.</Link>
            </div>
          )
        }
        <form onSubmit={this.onSubmit}>
          {
            this.isPartnerAdmin(this.props.user) && (
              <TextField
                className={this.props.classes.fields}
                id="name"
                required
                label="Company name"
                value={this.state.name}
                onChange={this.handleChange('name')}
                margin="normal"
              />
            )
          }

          <TextField
            className={this.props.classes.fields}
            id="logo"
            label="Company logo"
            disabled={!this.isPartnerOwnerActive(this.props.user) && !this.isPartnerAdmin(this.props.user)}
            value={this.state.logo}
            onChange={this.handleChange('logo')}
            margin="normal"
          />
          <TextField
            className={this.props.classes.fields}
            id="description"
            multiline
            label="Company information"
            value={this.state.description}
            disabled={!this.isPartnerOwnerActive(this.props.user) && !this.isPartnerAdmin(this.props.user)}
            onChange={this.handleChange('description')}
            margin="normal"
          />
          {
            this.isPartnerAdmin(this.props.user) && (
              <FieldWithChips
                collection={this.state.owners}
                name="owner"
                fieldLabel="Owner Login"
                buttonLabel="Add Partner Team Owner"
                chipsLabelExist="Team owners"
                chipsLabelNoExist="No team owners"
                value={this.state.owner.login}
                handleFieldChange={this.handleChangeObject('owner', 'login')}
                handleButtonClick={this.handleAddButtonObjectClick('owner', 'owners', 'login')}
                handleChipsDelete={this.handleChipsObjectDelete('owners')}
              />
            )
          }
          <FieldWithChips
            collection={this.state.members}
            name="member"
            fieldLabel="Member Login"
            buttonLabel="Add Partner Team Member"
            disabled={!this.isPartnerOwnerActive(this.props.user) && !this.isPartnerAdmin(this.props.user)}
            chipsLabelExist="Team members"
            chipsLabelNoExist="No team members"
            value={this.state.member.login}
            handleFieldChange={this.handleChangeObject('member', 'login')}
            handleButtonClick={this.handleAddButtonObjectClick('member', 'members', 'login')}
            handleChipsDelete={this.handleChipsObjectDelete('members')}
          />
          {
            this.isPartnerAdmin(this.props.user) && (
              <FieldWithChips
                collection={this.state.allowedDomains}
                name="allowedDomain"
                fieldLabel="Allowed domain"
                buttonLabel="Add allowed domain"
                chipsLabelExist="Allowed domains"
                chipsLabelNoExist="No allowed domains"
                value={this.state.allowedDomain}
                handleFieldChange={this.handleChange('allowedDomain')}
                handleButtonClick={this.handleAddButtonClick('allowedDomain', 'allowedDomains')}
                handleChipsDelete={this.handleChipsDelete('allowedDomains')}
              />
            )
          }
          <Button type="submit"
                  className={this.props.classes.fields}
                  variant="contained"
                  disabled={!this.isPartnerOwnerActive(this.props.user) && !this.isPartnerAdmin(this.props.user)}
                  color="primary"
                  size="medium">
            Save
          </Button>
        </form>
      </div>
    );
  }
}


const mapStateToProps = (state:any, props:any) => ({
  user: state.user
});

export default connect<any>(mapStateToProps, {
  editTeam,
  addMessage,
  getPartnerTeam
})(withStyles(styles)(EditPartnersTeamPage));
