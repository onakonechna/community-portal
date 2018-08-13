import * as React from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';
import * as _ from 'lodash';
import FieldWithChips from '../lib/FieldWithChips';
import {getPartnerTeamsList, saveTeam} from '../../../actions/partners';
import { connect } from "react-redux";

const styles = (theme: any) => ({
  'container': {
    'width': '60%',
    'margin': '0 auto'
  },
  'fields': {
    'width': '100%'
  }
});

class EditPartnersTeamPage extends React.Component<any, any> {
  constructor(props: any) {
    super(props);

    if (this.props.team) {
      this.state = {
        name: this.props.team.name,
        logo: this.props.team.logo,
        githubUrl: this.props.team.githubUrl,
        description: this.props.team.description,
        owners: this.props.team.owners,
        members: this.props.team.members,
        allowedDomains: this.props.team.allowedDomains
      };
    } else {
      this.state = {
        name: '',
        logo: '',
        githubUrl: '',
        description: '',
        owners: [],
        members: [],
        allowedDomains: []
      };
      this.props.getPartnerTeamsList();
    }
  }

  componentWillReceiveProps(props:any) {
      if (!this.props.team && props.team) {
        this.setState({
          name: props.team.name,
          logo: props.team.logo,
          githubUrl: props.team.githubUrl,
          description: props.team.description,
          owners: props.team.owners,
          members: props.team.members,
          allowedDomains: props.team.allowedDomains,
        })
      }
  }

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

  handleChange = (name: string) => (event: any) => {
    this.setState({
      [name]: event.target.value,
    });
  };

  onSubmit = (e: any) => {
    e.preventDefault();

    const data = {
      name: this.state.name,
      logo: this.state.logo,
      githubUrl: this.state.githubUrl,
      description: this.state.description,
      owners: this.state.owners,
      members: this.state.members,
      allowedDomains: this.state.allowedDomains
    };

    this.props.saveTeam(data)
      .then((data:any) => {
        this.props.history.push('/partners-management');
      });
  };

  public render() {
    return (
      <div className={this.props.classes.container}>
        <form onSubmit={this.onSubmit}>
          <TextField
            className={this.props.classes.fields}
            id="name"
            required
            label="Company name"
            value={this.state.name}
            onChange={this.handleChange('name')}
            margin="normal"
          />
          <TextField
            className={this.props.classes.fields}
            id="logo"
            label="Company logo"
            value={this.state.logo}
            onChange={this.handleChange('logo')}
            margin="normal"
          />
          <TextField
            className={this.props.classes.fields}
            id="githubUrl"
            label="Company GitHub url"
            value={this.state.githubUrl}
            onChange={this.handleChange('githubUrl')}
            margin="normal"
          />
          <TextField
            className={this.props.classes.fields}
            id="description"
            multiline
            label="Company information"
            value={this.state.description}
            onChange={this.handleChange('description')}
            margin="normal"
          />
          <FieldWithChips
            collection={this.state.owners}
            name="owner"
            fieldLabel="Owner Login"
            buttonLabel="Add Partner Team Owner"
            chipsLabelExist="Team owners"
            chipsLabelNoExist="No team owners"
            value={this.state.owner}
            handleFieldChange={this.handleChange('owner')}
            handleButtonClick={this.handleAddButtonClick('owner', 'owners')}
            handleChipsDelete={this.handleChipsDelete('owners')}
          />
          <FieldWithChips
            collection={this.state.members}
            name="member"
            fieldLabel="Member Login"
            buttonLabel="Add Partner Team Member"
            chipsLabelExist="Team members"
            chipsLabelNoExist="No team members"
            value={this.state.member}
            handleFieldChange={this.handleChange('member')}
            handleButtonClick={this.handleAddButtonClick('member', 'members')}
            handleChipsDelete={this.handleChipsDelete('members')}
          />
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
          <Button type="submit"
                  className={this.props.classes.fields}
                  variant="contained"
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
  partnerTeams: state.partners.teams,
  team: state.partners.teams.find((team:any) => team.id === Number(props.match.params.id)),
});

export default connect<any>(mapStateToProps, {
  saveTeam,
  getPartnerTeamsList
})(withStyles(styles)(EditPartnersTeamPage));
