import * as React from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { Link } from 'react-router-dom';
import { getPartnerTeamsList, deleteTeam } from '../../../actions/partners';
import List from '../lib/List';

const styles = (theme:any) => ({
    card: {
        maxWidth: 345,
    },
    mediaImage: {
      'max-width': '100%',
      margin: '0 auto'
    },
    media: {
        height: '280px',
        width: '100%',
        background: '#e4e4e459',
        margin: '25px auto 0',
        'border-radius': '3px',
        overflow: 'hidden',
        'box-shadow': '0px 0px 3px 0px rgba(0, 0, 0, 0.3)'
    },
    description: {
      height: '85px',
      overflow: 'hidden'
    },
    createButton: {
      width: '90%',
      margin: '20px 20px 10px 20px',
      display: 'inline-block',
      'text-decoration': 'none'
    },
    createButtonWrapper: {
        "text-align": 'center'
    },
    createButtonInner: {
        '&:hover': {background: '#008000'},
        width: '100%',
        padding: '20px',
        'font-size': '18px',
        'color': '#fff'
    },
    cardActions: {
      padding: '10px',
      display: 'flex',
      'justify-content': 'space-around',
      'background': '#e4e4e459'
    },
    cardWrapper: {
      width: '100%'
    },
    cardActionsBtn: {
      '&:hover': {background: '#B5B5B5'},
      'padding': '10px',
      'background': '#dcdcdc',
      'color': '#fff'
    },
    cardActionsLink: {
      'color': '#fff',
      'text-decoration': 'none'
    },
    cardActionsDelete: {
      '&:hover': {background: '#FF3D43'},
      'background': '#ff8181'
    }
});

class PartnersManagementPage extends React.Component<any> {
    constructor(props:any) {
        super(props);
    };

    componentDidMount() {
        this.props.getPartnerTeamsList();
    }

    deleteTeamHandler = (id:number) => this.props.deleteTeam(id);

    public render() {
        return (
            <div>
                <div className={this.props.classes.createButtonWrapper}>
                    <Link to={`/partners-management/create`} className={this.props.classes.createButton}>
                        <Button variant="contained" color="primary" size="medium" className={this.props.classes.createButtonInner}>
                            Create new partner team
                        </Button>
                    </Link>
                </div>
                <List>
                {
                    this.props.partnerTeams.map((team:any, i:any) =>
                    <div key={i} className={this.props.classes.cardWrapper}>
                        <Card className={this.props.classes.card}>
                            <div className={this.props.classes.media}>
                              {
                                team.avatar_url && (
                                  <img className={this.props.classes.mediaImage} src={team.avatar_url} alt={team.name}/>
                                )
                              }
                            </div>
                            <CardContent>
                                <Typography gutterBottom variant="headline" component="h2">
                                    <a href={team.url}>{team.name}</a>
                                </Typography>
                                <Typography component="p" className={this.props.classes.description}>
                                    {team.description}
                                </Typography>
                            </CardContent>
                            <CardActions className={this.props.classes.cardActions}>
                                <Button size="small" color="primary" className={this.props.classes.cardActionsBtn}>
                                    <Link className={this.props.classes.cardActionsLink} to={`/partners-management/view/${team.row_id}`}>View</Link>
                                </Button>
                                <Button size="small" color="primary" className={this.props.classes.cardActionsBtn}>
                                    <Link className={this.props.classes.cardActionsLink} to={`/partners-management/edit/${team.row_id}`}>Edit</Link>
                                </Button>
                                <Button size="small" color="primary" className={`${this.props.classes.cardActionsBtn} ${this.props.classes.cardActionsDelete}`} onClick={this.deleteTeamHandler.bind(team.row_id)}>
                                    Delete
                                </Button>
                            </CardActions>
                        </Card>
                    </div>)
                }
                </List>
            </div>
        );
    }
}

const mapStateToProps = (state:any) => ({
    partnerTeams: state.partners.teams || []
});

export default connect<any>(mapStateToProps, {
    getPartnerTeamsList,
    deleteTeam
})(withStyles(styles)(PartnersManagementPage));
