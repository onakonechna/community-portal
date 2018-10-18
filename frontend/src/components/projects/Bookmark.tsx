import { connect } from 'react-redux';
import compose from "recompose/compose";
import * as React from "react";
import { withStyles } from '@material-ui/core/styles';
import { bookmarkProject, unbookmarkProject } from '../../actions/project';
import BookmarkButton from '../buttons/BookmarkButton';
import { loadingProcessStart, loadingProcessEnd } from '../../actions/loading';

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

    if (this.props.isBookmarked) {
      this.props.loadingProcessStart('unbookmark_project', true);
      this.handleUnbookmarkProject()
        .then(() => this.props.loadingProcessEnd('unbookmark_project'))
    } else {
      this.props.loadingProcessStart('bookmark_project', true);
      this.handleBookmarkProject()
        .then(() => this.props.loadingProcessEnd('bookmark_project'))
    }
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
  isBookmarked: !!props.project.bookmarked.find((user:any) => user.id === state.user.id),
  isAuthorized: !!state.user.id
});

export default compose<{}, any>(
  withStyles(styles, {name: 'BookmarkProject'}),
  connect<{}, any, any>(mapStateToProps, {
    bookmarkProject,
    unbookmarkProject,
    loadingProcessStart,
    loadingProcessEnd
  }),
)(Bookmark);