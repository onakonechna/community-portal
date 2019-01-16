import * as React from 'react'
import {withStyles} from "@material-ui/core/styles";
import CardContent from "@material-ui/core/CardContent/CardContent";
import Card from "@material-ui/core/Card/Card";
import Divider from "@material-ui/core/Divider";
import CircularProgress from '@material-ui/core/CircularProgress';

const styles = () => ({
    widgetCard: {
        'background': '#fff',
        'display': 'inline-block',
        'font-family': 'system-ui',
        'color': '#6b6868',
        'font-size': '14px',
        'margin': '10px',
        'width': '600px',
        'min-width': '530px',
        ['@media (max-width: 1520px)']: {
            'width': '800px'
        }
    },
    header: {
        'padding-bottom': '10px',
        display: 'flex',
        'justify-content': 'space-between',
        'vertical-align': 'middle',
        'align-items': 'center'
    },
    widgetCardTitle: {
        'font-size': '16px',
        'display': 'inline-block',
        'color': '#6b6868',
        'font-family': 'system-ui',
        'font-weight': 'bold'
    },
    underline: {
        'border-bottom': '1px solid #6b6868',
        'padding-bottom': '3px',
        cursor: 'pointer',
        'color': '#6b6868',
        'text-decoration': 'none'
    },
    widgetCardText: {
        'font-size': '14px',
        'font-family': 'system-ui',
        'color': '#6b6868',
    },
    'width50': {
        'width': '50%'
    },
    'width100': {
        'width': '100%'
    },
    'containers': {
        'display': 'inline-block'
    },
    'progress': {
        'position': 'relative',
        'width': '180px',
        'height': '180px',
        'display': 'inline-block',
        '& > *': {
            position: 'absolute',
            left: '0',
            top: '0'
        }
    },
    'rateDataContainer': {
        display: 'inline-block',
        'margin': '0 20px',
        'text-align': 'left',
        '& > span': {
            'font-weight': 300
        }
    },
    'contentContainer': {
        'align-items': 'center',
        'display': 'inline-block',
        'vertical-align': 'top',
        'margin': '20px 0'

    },
    'bold': {
        'font-weight': 'bold'
    },
    rateResult: {
        position: 'absolute',
        left: '50%',
        'margin-left': '-44px',
        'margin-top': '-25px',
        top: '50%',
        'font-size': '44px',
        'font-weight': 'bold'
    },
    legend: {
        'width': '40px',
        height: '15px',
        display: 'inline-block',
        'vertical-align': 'top'
    },
    legendTotal: {
        background: '#f1e7e7',
        border: '1px solid #d3d3d3'
    },
    mergedLegend: {
        background: '#ff5700',
        border: '1px solid #e25004'
    },
    legendContainer: {
        width: '180px',
        'text-align': 'center',
        margin: '15px 0',
    },
    alignText: {
        'vertical-align': 'top',
        'margin': '0 0 0 7px'
    },
    itemMargin: {
        'margin': '5px 0'
    },
	  leftContainer: {
        'display': 'inline-block',
          ['@media (max-width: 550px)']: {
            'width': '100%',
            'text-align': 'center'
          }
    },
    blueBox: {
        color: '#fff',
        padding: '5px',
        background: '#27a7ff',
        'box-sizing': 'border-box',
        'border-radius': '4px',
        'font-weight': 'bold',
        'vertical-align': 'middle',
        'display': 'inline-block',
        'margin': '5px',
        'width': '45px',
        'text-align': 'center'
    },
	  mobileListContainer: {
			['@media (max-width: 550px)']: {
				'text-align': 'left'
			}
    }
});

// @ts-ignore
class ProfileWidget extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            statistic: [],
            total: 0,
            merged: 0
        }
    }

    // @ts-ignore
    getSuccessPercent = () => parseInt(100/(this.state.total/this.state.merged)) || 0;

    componentWillReceiveProps(props:any) {
        // @ts-ignore
        if (!this.props.statistic.length && props.statistic.length) {
            this.setState({statistic: props.statistic, ...this.getTotalAndMerged(props.statistic)});
        }
    }

    // @ts-ignore
	  getOpenPRs = data => this.props.statistic.filter(item => item.openQuantity !== 0);

    getTotalAndMerged(data) {
        let merged = 0;
        let total = 0;

        data.forEach(item => {
            merged += item.mergedQuantity;
            total += item.mergedQuantity + item.closedQuantity;
        });

        return {
            total,
            merged
        };
    }

    render() {
        // @ts-ignore
        const classes = this.props.classes || {};
        // @ts-ignore
        const state = this.state;
			  // @ts-ignore
			  const openPrs = this.getOpenPRs(this.props.statistic);

			  return (
            <Card className={classes.widgetCard}>
                <CardContent>
                    <div className={`${classes.width50} ${classes.leftContainer}`}>
                        <div className={classes.header}>
                            <div className={classes.widgetCardTitle}>Pull Requests Acceptance Rate</div>
                        </div>
                        <Divider/>
                        <div className={`${classes.contentContainer}` }>
                            <div className={classes.progress}>
                                <div className={classes.rateResult}>
                                    {`${this.getSuccessPercent()}%`}
                                </div>
                                <CircularProgress
                                    variant="static"
                                    style={{ color: '#f1e7e7'}}
                                    size={180}
                                    value={100}
                                    thickness={2}
                                />
                                <CircularProgress
                                    variant="static"
                                    style={{ color: '#ff5700'}}
                                    thickness={2}
                                    size={180}
                                    value={this.getSuccessPercent()}
                                />
                            </div>
                            <div className={classes.legendContainer}>
                                <div className={classes.rateDataContainer}>
                                    <div className={classes.itemMargin}>
                                        <span className={`${classes.legend} ${classes.legendTotal}`}/>
                                        {
                                            // @ts-ignore
                                            <span className={classes.alignText}>Total: {state.total}</span>
                                        }
                                    </div>
                                    <div className={classes.itemMargin}>
                                        <span className={`${classes.legend} ${classes.mergedLegend}`}/>
                                        {
                                            // @ts-ignore
                                            <span className={classes.alignText}>Merged: {state.merged}</span>
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
									  <div className={`${classes.width50} ${classes.leftContainer}`}>
											<div className={classes.header}>
												<div className={classes.widgetCardTitle}>Pull Requests Open</div>
											</div>
											<Divider/>
                      <div className={`${classes.contentContainer} ${classes.mobileListContainer}`}>
												{
													// @ts-ignore
													openPrs.length ?
														openPrs.filter(item => item.openQuantity !== 0).map(item =>
																<div key={item.repository}>
																	<div className={classes.blueBox}>{item.openQuantity}</div>
																	<span>
												{
													// @ts-ignore
													<a className={`${classes.link} ${classes.underline}`} href={`https://github.com/${item.repository}/pulls/${this.props.user.login}`} target="_blank">
														{item.repository}
													</a>
												}
											</span>
																</div>
														) :
														<div>
															No Open Pull Requests
														</div>
												}
											</div>
                    </div>
                </CardContent>
            </Card>
        )
    }
}

// @ts-ignore
export default withStyles(styles)(ProfileWidget);
