import * as React from 'react';
import { loadSurvey, saveResults, handleMessage, clearMessage } from "../../actions/survey";
import { loadingProcessStart, loadingProcessEnd } from '../../actions/loading';
import compose from "recompose/compose";
import { connect } from 'react-redux';
import withStyles from '@material-ui/core/styles/withStyles';
import Question from './Question';
import SubmitButton from '../buttons/SubmitButton';
import Typography from "@material-ui/core/Typography/Typography";
import Grid from "@material-ui/core/Grid/Grid";
import CardContent from "@material-ui/core/CardContent/CardContent";
import Card from "@material-ui/core/Card/Card";
import CardActions from "@material-ui/core/CardActions/CardActions";
import SuccessIcon from '@material-ui/icons/DoneAll';
import ErrorIcon from '@material-ui/icons/ErrorOutline';

interface DispatchProps {
    loadSurvey: any,
    saveResults: any
}

const styles: any = (theme: any) => ({
    surveyName: {
        [theme.breakpoints.down('sm')]: {
            width: '85%',
            fontSize: '1.2em',
        },
        [theme.breakpoints.up('sm')]: {
            width: '90%',
            fontSize: '1.5em',
        },
        [theme.breakpoints.up('md')]: {
            width: '92%',
            fontSize: '1.8em',
        },
        [theme.breakpoints.up('lg')]: {
            width: '94%',
            fontSize: '2em',
        },
        fontWeight: '500',
        margin: 'auto',
        'overflow-wrap': 'break-word',
    },
    grid: {
        [theme.breakpoints.down('sm')]: {
            width: '20rem',
        },
        [theme.breakpoints.up('sm')]: {
            width: '30rem',
        },
        [theme.breakpoints.up('md')]: {
            width: '40rem',
        },
        [theme.breakpoints.up('lg')]: {
            width: '55rem',
        },
        display: 'flex',
        'flex-direction': 'column',
        margin: 'auto',
        'margin-top': '1rem',
    },
    card: {
        'background-color': '#fff',
        'border-top': '1px solid #b9bdbd',
        'margin-top': '20px',
        'width': '100%',
        'border-radius': '0',
        'box-shadow': 'none'
    },
    content: {
        margin: '0 1rem 1rem',
    },
    cardAction: {
        'border-top': '1px solid #b9bdbd',
    },
    smallTextSuccess: {
        fontSize: '1.2rem',
        marginBottom: '0.25rem',
        color: 'green',
    },
    smallTextError: {
        fontSize: '1.2rem',
        marginBottom: '0.25rem',
        color: 'red',
    },
});

class SurveyPage extends React.Component<any, any> {

    constructor(props: DispatchProps) {
        super(props);

        this.state = {
            questions: []
        }
    }

    componentDidMount() {
        let res = this.props.repo_details.split('+');
        if (this.props.survey_name == null || res.length < 3) {
            this.props.handleMessage('Your url is invalid, please, use correct one.', true);
        } else if (this.props.authorized){
            this.props.loadingProcessStart('survey_load_project', true);
            this.props.loadSurvey(this.props.survey_name, this.props.repo_details)
                .then(() => this.props.loadingProcessEnd('survey_load_project'));
        } else if (!this.props.authorized) {
            this.props.handleMessage('Please sign in to access the survey.', true);
        }
    }

    componentWillReceiveProps(props:any) {
        if (!this.props.authorized && props.authorized) {
            this.props.loadingProcessStart('survey_load_project', true);
            this.props.loadSurvey(this.props.survey_name, this.props.repo_details)
                .then(() => this.props.loadingProcessEnd('survey_load_project'));
            this.props.clearMessage();
        }
    }

    onSubmit() {
        let dataToSave = {},
            isErrored = false;

        this.state.questions.map(function(value:any, index:any) {

            if(!value.getIsRequired() && !value.getData()) {
                return;
            }

            if (value.getIsRequired() === 1 && !value.getData()) {
                value.setIsErrored(true);
                isErrored = true;
                return;
            }
            dataToSave[value.getId()] = value.getData();
        });

        if (!isErrored) {
            this.props.loadingProcessStart('survey_save_project', true);
            this.props.saveResults({
                survey_id: this.props.surveyBody.data.id,
                scope: this.props.repo_details,
                selected: dataToSave
            }).then(() => this.props.loadingProcessEnd('survey_save_project'))
        }
    }

    render() {
        const { classes } = this.props;
        return (
            <div>

                <Grid
                    container
                    justify="center"
                    className={classes.grid}
                >
                    { this.props.surveyBody ?
                        <div>
                            <Typography className={classes.surveyName}>
                                { this.props.surveyBody.data.text }
                            </Typography>
                            <Card className={classes.card}>
                                <CardContent className={classes.content}>
                                    { this.props.surveyQuestions.map((question:any, index:any) =>
                                        (<Question
                                            key={index}
                                            innerRef={(ref) => this.state.questions[index] = ref}
                                            question={question}
                                        />)) }
                                </CardContent>
                            </Card>
                            <CardActions className={classes.cardAction}>
                                <SubmitButton
                                    disabled={this.props.isSurveySaved || this.props.surveySaving}
                                    label={"Submit Survey"}
                                    handler={this.onSubmit.bind(this)}
                                />
                            </CardActions>
                        </div>
                    : '' }
                    { this.props.surveyMessage ?
                        <div style={{textAlign: 'center'}} className={this.props.surveyError ? classes.smallTextError : classes.smallTextSuccess}>
                            <div style={{display: 'inline-block', height: '2.0rem'}}>
                                {this.props.surveyError ? <ErrorIcon/> : <SuccessIcon/> }
                            </div>
                            <div style={{display: 'inline-block', height: '2.0rem', marginLeft: '0.8rem', verticalAlign: 'top'}}>
                                <Typography className={this.props.surveyError ? classes.smallTextError : classes.smallTextSuccess}>
                                    { this.props.surveyMessage }
                                </Typography>
                            </div>
                        </div>
                    : '' }
                </Grid>
            </div>
        );
    }
}

const mapStateToProps = (state:any, props:any) => {
    return {
        surveyBody: state.survey.entity ? state.survey.entity.body : null,
        surveyQuestions: state.survey.entity ? state.survey.entity.questions : [],
        surveyError: state.survey.surveyError || false,
        surveyMessage: state.survey.surveyMessage || '',
        isSurveySaved: state.survey.isSaved || false,
        surveySaving: state.survey.surveySaving || false,
        authorized: state.user.id,
    }
};

export default compose<{}, any>(
    withStyles(styles, {name: 'Survey'}),
    connect<{}, any, any>(
        mapStateToProps,
        {loadSurvey, saveResults, handleMessage,loadingProcessStart, loadingProcessEnd, clearMessage}
    ),
)(SurveyPage);
