import * as React from 'react';
import { convertToRaw, Editor, EditorState, RichUtils, convertFromRaw } from 'draft-js';

interface RichEditorProps {
  update: (output: string) => void;
  content?: any;
}

interface RichEditorState {
  editorState: any;
}

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
    return (
      <div>
        <button onClick={this.onBoldClick}>Bold</button>
        <button onClick={this.onUnderlineClick}>Underline</button>
        <button onClick={this.onItalicClick}>Italic</button>
        <Editor
            editorState={this.state.editorState}
            handleKeyCommand={this.handleKeyCommand}
            onChange={this.onChange}
        />
      </div>
    );
  }
}

export default RichEditor;
