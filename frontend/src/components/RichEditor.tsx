import * as React from 'react';
import { convertToRaw, Editor, EditorState, RichUtils, convertFromRaw } from 'draft-js';
import { withStyles } from '@material-ui/core/styles';
import compose from 'recompose/compose';

interface RichEditorProps {
  update: (output: string) => void;
  content?: any;
  classes?: any;
}

interface RichEditorState {
  editorState: any;
}

const styles = {
  buttons: {
    'margin-bottom': '0.5rem',
  },
  editor: {
    borderBottom: '1px solid #D4D4D4',
    'font-family': 'system-ui',
  },
  editorGrid: {
    margin: '1rem auto',
  },
};

class RichEditor extends React.Component<RichEditorProps, RichEditorState> {
  constructor(props:RichEditorProps) {
    super(props);
    this.state = { editorState: EditorState.createEmpty() };
    this.onChange = this.onChange.bind(this);
    this.handleKeyCommand = this.handleKeyCommand.bind(this);
    this.onBoldClick = this.onBoldClick.bind(this);
    this.onUnderlineClick = this.onUnderlineClick.bind(this);
    this.onItalicClick = this.onItalicClick.bind(this);
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

  onChange(editorState:any) {
    const contentState = editorState.getCurrentContent();
    this.setState({ editorState });
    this.props.update(JSON.stringify(convertToRaw(contentState)));
  }

  handleKeyCommand(command:any, editorState:any) {
    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      this.onChange(newState);
      return 'handled';
    }
    return 'not-handled';
  }

  onBoldClick() {
    this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, 'BOLD'));
  }

  onUnderlineClick() {
    this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, 'UNDERLINE'));
  }

  onItalicClick() {
    this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, 'ITALIC'));
  }

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.editorGrid}>
        <div className={classes.buttons}>
          <button onClick={this.onBoldClick}><b>B</b></button>
          <button onClick={this.onUnderlineClick}><u>U</u></button>
          <button onClick={this.onItalicClick}><i>I</i></button>
        </div>
        <div style={styles.editor}>
          <Editor
              editorState={this.state.editorState}
              handleKeyCommand={this.handleKeyCommand}
              onChange={this.onChange}
          />
        </div>
      </div>
    );
  }
}

export default compose<{}, RichEditorProps>(
  withStyles(styles, {
    name: 'RichEditor',
  }),
)(RichEditor);
