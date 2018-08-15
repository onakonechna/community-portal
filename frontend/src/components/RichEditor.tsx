import * as React from 'react';
import { Editor, EditorState, RichUtils } from 'draft-js';
import { stateToHTML } from 'draft-js-export-html';

interface RichEditorProps {
  update: (output: string, richOutput: any) => void;
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

  onChange(editorState:any) {
    const contentState = editorState.getCurrentContent();
    const output = stateToHTML(contentState);
    this.setState({ editorState });
    this.props.update(output, contentState);
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
