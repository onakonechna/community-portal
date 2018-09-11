import { connect } from 'react-redux';
import compose from "recompose/compose";
import * as React from "react";
import * as _ from "lodash";
import { withStyles } from '@material-ui/core/styles';
import { bookmarkProject, unbookmarkProject } from '../../actions/project';
import BookmarkButton from '../buttons/BookmarkButton';

const styles = {
  joinText: {
    'font-size': '0.9rem',
  },
};

class Bookmark extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      open: false,
      success: false,
      loading: false
    };
  }

  handler = (e:any) => {
    e.preventDefault();
    e.stopPropagation();
    this.props.isBookmarked ? this.handleUnbookmarkProject() : this.handleBookmarkProject();
  };

  handleBookmarkProject = () => this.props.bookmarkProject(this.props.project, this.props.user);
  handleUnbookmarkProject = () => this.props.unbookmarkProject(this.props.project, this.props.user);

  render() {
    return this.props.isAuthorized ? (
      <BookmarkButton
        handler={this.handler}
        className={this.props.bookmarkClass}
        bookmarked={this.props.isBookmarked}/>
    ) : null
  }
}

const mapStateToProps = (state:any, props:any) => ({
  user: state.user,
  isBookmarked: !!_.get(props, `project.bookmarked.${state.user.user_id}]`),
  isAuthorized: !!state.user.user_id
});

export default compose<{}, any>(
  withStyles(styles, {name: 'BookmarkProject'}),
  connect<{}, any, any>(mapStateToProps, {bookmarkProject, unbookmarkProject}),
)(Bookmark);