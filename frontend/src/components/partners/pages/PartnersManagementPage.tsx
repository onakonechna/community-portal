import * as React from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { Link } from 'react-router-dom';
import { getPartnerTeamsList, deleteTeam } from '../../../actions/partners';
import List from '../lib/List';

const styles = {
    card: {
        maxWidth: 345,
    },
    media: {
        height: 0,
        paddingTop: '56.25%', // 16:9
    },
};

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
                <div>
                    <Link to={`/partners-management/create`}>
                        <Button variant="contained" color="primary" size="medium">
                            Create
                        </Button>
                    </Link>
                </div>
                <List>
                {
                    this.props.partnerTeams.map((team:any, i:any) =>
                    <div key={i}>
                        <Card className={this.props.classes.card}>
                            <CardMedia
                                className={this.props.classes.media}
                                image={team.logo}
                                title={team.name}
                            />
                            <CardContent>
                                <Typography gutterBottom variant="headline" component="h2">
                                    <a href={console.log(team) || team.githubUrl}>{team.name}</a>
                                </Typography>
                                <Typography component="p">
                                    {team.description}
                                </Typography>
                            </CardContent>
                            <CardActions>
                                <Button size="small" color="primary">
                                    <Link to={`/partners-management/view/${team.id}`}>View</Link>
                                </Button>
                                <Button size="small" color="primary">
                                    <Link to={`/partners-management/edit/${team.id}`}>Edit</Link>
                                </Button>
                                <Button size="small" color="primary" onClick={this.deleteTeamHandler.bind(team.id)}>
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
