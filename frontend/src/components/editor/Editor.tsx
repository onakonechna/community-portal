import * as React from "react";
import Draft from 'react-wysiwyg-typescript';
import {Theme, withStyles} from "@material-ui/core/styles";
import {convertFromRaw, convertToRaw, EditorState} from 'draft-js';

const styles = (theme: Theme) => ({
  editor: {
    'font-family': 'system-ui',
    'border': '1px solid #d9d9d9',
    'padding': '10px',
    'min-height': '160px',
    'box-sizing': 'border-box',
    'border-radius': '2px',
    'line-height': '21px',
    'font-size': '14px'
  },
});

export class Editor extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      editorState: EditorState.createEmpty(),
    }
  }

  componentDidMount() {
    const { content } = this.props;
    if (content) {
      const editor = EditorState.createWithContent(convertFromRaw(JSON.parse(content)));
      this.setState({
        editorState: editor,
      });
    }
  }

  handleEditorStateChange = (editorState:any) => {
    const contentState = editorState.getCurrentContent();

    this.setState({
      editorState,
    });

    this.props.onContentChange(JSON.stringify(convertToRaw(contentState)));
  };

  render() {
    return (
      <Draft
        editorState={this.state.editorState}
        editorClassName={this.props.classes.editor}
        onEditorStateChange={this.handleEditorStateChange}
        stripPastedStyles
      />
    );
  }
}

export default withStyles(styles, {
  name: 'Editor',
})(Editor);
