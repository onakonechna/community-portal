import * as React from 'react';
import { connect } from 'react-redux';
import compose from 'recompose/compose';

import { withStyles } from '@material-ui/core/styles';

import ProjectMain from './ProjectMain'
import Container from './Container';

import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

const styles = (theme: any) => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
  },
  tabsRoot: {
    borderBottom: '1px solid #e8e8e8',
  },
  tabsIndicator: {
    backgroundColor: '#f16321',
  },
  tabRoot: {
    fontWeight: theme.typography.fontWeightRegular,
    marginRight: theme.spacing.unit * 4,
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
    '&:hover': {
      color: '#f16321',
      opacity: 1,
    },
    '&$tabSelected': {
      color: '#f16321',
      fontWeight: theme.typography.fontWeightMedium,
    },
    '&:focus': {
      color: '#f16321',
    },
  },
  tabSelected: {},
  typography: {
    padding: theme.spacing.unit * 3,
  },
});

const fieldMap = [
  ['status', 'Status'],
  ['size', 'Size'],
  ['upvotes', 'Upvotes'],
  ['owner', 'Owner'],
  ['estimated', 'Estimated'],
  ['pledged', 'Pledged'],
  ['completed', 'Completed'],
  ['github_address', 'GitHub'],
  ['slack_channel', 'Slack'],
];

const chipMap = [
  ['skills', 'Skills'],
  ['technologies', 'Technologies'],
  ['tags', 'Tags'],
];

export class ProjectView extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      value: 0,
    };
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event: any, value: any) {
    this.setState({ value });
  }

  render() {
    const { classes } = this.props;
    const { value } = this.state;

    return (
      <div className={classes.root}>
        <Tabs
          value={value}
          onChange={this.handleChange}
          classes={{ root: classes.tabsRoot, indicator: classes.tabsIndicator }}
          fullWidth
        >
          <Tab
            disableRipple
            classes={{ root: classes.tabRoot, selected: classes.tabSelected }}
            label="Main"
          />
          <Tab
            disableRipple
            classes={{ root: classes.tabRoot, selected: classes.tabSelected }}
            label="Statistics"
          />
        </Tabs>
        {value === 0 && <Container>
          <ProjectMain
            project_id={this.props.match.params.project_id}
            fieldMap={fieldMap}
            chipMap={chipMap}
          />
        </Container>}
        {value === 1 && <Container>Statistics</Container>}
      </div>
    );
  }
}

const mapStateToProps = (state: any) => {
  return {};
};

const mapDispatchToProps = (dispatch: any) => {
  return {};
};

export default compose<{}, {}>(
  withStyles(styles, {
    name: 'ProjectView',
  }),
  connect<{}, {}, {}>(mapStateToProps, mapDispatchToProps),
)(ProjectView);
