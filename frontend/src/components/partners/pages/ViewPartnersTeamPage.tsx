import * as React from 'react';
import { withStyles } from '@material-ui/core/styles';
import * as _ from 'lodash';
import { getPartnerTeamsList, getPartnerTeam } from '../../../actions/partners';
import { connect } from "react-redux";
import CardMedia from '@material-ui/core/CardMedia';


const styles = (theme: any) => ({
  'container': {
    'width': '80%',
    'margin': '30px auto',
    'font-family': 'Arial, sans-serif'
  },
  'logo': {
    'width': '200px',
    'display': 'block',
    'margin': '0 auto'
  },
  'headerContainer': {
    'text-align': 'center'
  },
  'name': {
    'font-size': '32px',
    'color': '#24292e',
  },
  'title': {
    'padding': '25px 30px',
    'box-sizing': 'border-box'
  },
  'description': {
    'text-align': 'center'
  }
});

class ViewPartnersTeamPage extends React.Component<any, any> {
  constructor(props: any) {
    super(props);

    this.state = {
      name: '',
      logo: '',
      githubUrl: '',
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
      .then((data:any) => {
        const {name, logo, githubUrl, description, owners, members, allowedDomains, id} = data;
        this.setState({name, logo, githubUrl, description, owners, members, allowedDomains, id});
      })
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
        <div className={this.props.classes.headerContainer}>
          <div>
            <img className={this.props.classes.logo} src={'https://avatars1.githubusercontent.com/t/2653557?s=280&v=4'}/>
          </div>
          <div className={this.props.classes.title}>
            <a href={this.state.githubUrl} className={this.props.classes.name}>{this.state.name}</a>
          </div>
        </div>
        <div className={this.props.classes.description}>
          <span>{this.state.description}</span>
        </div>
        <div>
          {this.state.owners.map((owner:any, key:any) => (
            <div key={key}>
              <div>{owner.name}</div>
              <CardMedia
                className={this.props.classes.media}
                image={owner.avatar_url}
                title={owner.name}
              />
            </div>
          ))}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state:any, props:any) => ({
  partnerTeams: state.partners.teams,
  team: state.partners.teams.find((team:any) => team.id === props.match.params.id) || {},
});

export default connect<any>(mapStateToProps, {
  getPartnerTeamsList,
  getPartnerTeam
})(withStyles(styles)(ViewPartnersTeamPage));
