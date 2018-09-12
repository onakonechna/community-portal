import * as React from 'react';
import * as _ from 'lodash';
import {connect} from 'react-redux';
import LinearProgress from '@material-ui/core/LinearProgress';
import {withStyles} from "@material-ui/core/styles";
import compose from "recompose/compose";

const styles = (theme:any) => ({
  color: {
    backgroundColor: '#F16321',
  },

  colorSecondary: {
    backgroundColor: '#FACCB7',
  },
  loadingLine: {
    height: '2px',
    overflow: 'hidden'
  }
});

class LoadingLine extends React.Component<any, any> {
  private timer:any;

  constructor(props: any) {
    super(props);

    this.state = {
      completed: 0,
      show: false
    };
  }

  componentDidMount() {
    this.loading();
  }

  componentDidUpdate() {
    this.loading();
  }

  componentWillUnmount() {
    clearTimeout(this.timer);
  }

  loading = () => {
    if (this.showLoader()) {
      this.setState({show: true});
      this.timer = setTimeout(() => this.progress(10), 100);
    }
  };

  hasGlobal = () => !!_.filter(this.props.loading, value => value.global).length;

  showLoader = () => !_.isEmpty(this.props.loading) && !this.state.show && this.hasGlobal();

  progress(completed:any) {
    if (_.isEmpty(this.props.loading)) {
      this.setState({completed: 100});
      setTimeout(() => {
        this.setState({
          show: false,
          completed: 0
        })
      }, 300);
      return;
    } else if (completed >= 150 && !_.isEmpty(this.props.loading) && this.hasGlobal()) {
      completed = 0;
        this.setState({completed: completed});
        setTimeout(() => {
          this.timer = setTimeout(
            () => this.progress(Math.min(completed + (Math.random() * 30), 100)), 300);
        }, 500);
      return;
    } else {
      this.setState({completed});
    }

    this.timer = setTimeout(() => this.progress(Math.min(completed + (Math.random() * 20), 150)), 200);
  }

  render() {
    return (
      <div className={this.props.classes.loadingLine}>
        {this.state.show && <LinearProgress classes={{
          barColorPrimary: this.props.classes.color,
          colorPrimary: this.props.classes.colorSecondary,
        }} variant="determinate" value={this.state.completed}/>}
      </div>
    )
  }

}

const mapStateToProps = (state:any) => ({
  loading: state.loading,
});

export default compose<{}, any>(
  withStyles(styles, {
    name: 'LoadingLine',
  }),
  connect(
    mapStateToProps, {},
  ),
)(LoadingLine);

