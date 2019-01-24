import * as React from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import { withStyles } from '@material-ui/core/styles';
import * as _ from 'lodash';
import FieldWithChips from '../lib/FieldWithChips';
import {saveTeam} from '../../../actions/partners';
import { connect } from "react-redux";
import { addMessage, deleteMessage } from "../../../actions/messages";

const styles = (theme: any) => ({
    'container': {
        'width': '60%',
        'margin': '0 auto'
    },
    'fields': {
        'width': '100%'
    },
    'teamNameContainer': {

    }
});

class CreatePartnersTeamPage extends React.Component<any, any> {
    constructor(props: any) {
        super(props);

        this.state = {
            name: '',
            logo: '',
            githubTeamName: '',
            isNewTeam: true,
            description: '',
            owner: {login: '', id: ''},
            owners: [],
            member: {login:'', id: ''},
            members: [],
            allowedDomain: '',
            allowedDomains: []
        }
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

    handleCheckboxChange = (name: string) => (event: any) => {
        this.setState({
            [name]: !this.state[name],
        });
    };

    onSubmit = (e: any) => {
        e.preventDefault();

        const data = {
            name: this.state.name,
            logo: this.state.logo,
            isNewTeam: this.state.isNewTeam,
            githubTeamName: this.state.githubTeamName,
            description: this.state.description,
            owners: this.state.owners,
            members: this.state.members,
            allowedDomains: this.state.allowedDomains,
            id: this.state.name.toLowerCase().replace(' ', '-')
        };

        this.props.saveTeam(data)
            .then((data:any) => {
                if (!data.error) {
                    this.props.history.push('/partners-management');
                    this.props.addMessage({
                        type: 'success',
                        massage: 'Team was successfully created'
                    })
                } else {
                    this.props.addMessage({
                        type: 'error',
                        massage: data.message
                    })
                }
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
                    <div className={this.props.classes.teamNameContainer}>
                        <TextField
                            className={this.props.classes.fields}
                            id="githubTeamName"
                            required
                            label="GitHub team name"
                            value={this.state.githubTeamName}
                            onChange={this.handleChange('githubTeamName')}
                            margin="normal"
                        />
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={this.state.isNewTeam}
                                    onChange={this.handleCheckboxChange('isNewTeam')}
                                    value="true"
                                    color="primary"
                                />
                            }
                            label="Create new team on GitHub"
                        />
                    </div>
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
                        value={this.state.owner.login}
                        handleFieldChange={this.handleChangeObject('owner', 'login')}
                        handleButtonClick={this.handleAddButtonObjectClick('owner', 'owners', 'login')}
                        handleChipsDelete={this.handleChipsObjectDelete('owners')}
                    />
                    <FieldWithChips
                        collection={this.state.members}
                        name="member"
                        fieldLabel="Member Login"
                        buttonLabel="Add Partner Team Member"
                        chipsLabelExist="Team members"
                        chipsLabelNoExist="No team members"
                        value={this.state.member.login}
                        handleFieldChange={this.handleChangeObject('member', 'login')}
                        handleButtonClick={this.handleAddButtonObjectClick('member', 'members', 'login')}
                        handleChipsDelete={this.handleChipsObjectDelete('members')}
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

export default connect<any>(null, {
    saveTeam,
    addMessage,
    deleteMessage
})(withStyles(styles)(CreatePartnersTeamPage));
