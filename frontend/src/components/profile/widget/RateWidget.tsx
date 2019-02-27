import * as React from 'react'
import withStyles from '@material-ui/core/styles/withStyles';
import CardContent from "@material-ui/core/CardContent/CardContent";
import Card from "@material-ui/core/Card/Card";
import Divider from "@material-ui/core/Divider";
import CircularProgress from '@material-ui/core/CircularProgress';
import styles from './RateWidget.style';

// @ts-ignore
class ProfileWidget extends React.Component {
    constructor(props) {
        super(props);

        let state = {
					// @ts-ignore
					statistic: [],
            total: 0,
            merged: 0
        };

			  // @ts-ignore
			  if (this.props.statistic.length) {
					// @ts-ignore
					const { total, merged } = this.getTotalAndMerged(this.props.statistic);
					// @ts-ignore
					state.statistic = this.props.statistic;
					state.total = total;
					state.merged = merged;
        }

        this.state = state;
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
												<div className={classes.widgetCardTitle}>Open Pull Requests</div>
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
