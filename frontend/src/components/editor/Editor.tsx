import * as React from 'react';
import sanitizeHtml from 'sanitize-html';
import CKEditor from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-editor-classic/src/classiceditor';
import FontSize from '@ckeditor/ckeditor5-font/src/font';
import FontFamily from '@ckeditor/ckeditor5-font/src/fontfamily';
import Autoformat from '@ckeditor/ckeditor5-autoformat/src/autoformat';
import Heading from '@ckeditor/ckeditor5-heading/src/heading';
import List from '@ckeditor/ckeditor5-list/src/list';
import Bold from '@ckeditor/ckeditor5-basic-styles/src/bold';
import Italic from '@ckeditor/ckeditor5-basic-styles/src/italic';
import Strikethrough from '@ckeditor/ckeditor5-basic-styles/src/strikethrough';
import Superscript from '@ckeditor/ckeditor5-basic-styles/src/superscript';
import Paragraph from '@ckeditor/ckeditor5-paragraph/src/paragraph';
import PasteFromOffice from '@ckeditor/ckeditor5-paste-from-office/src/pastefromoffice';
import Table from '@ckeditor/ckeditor5-table/src/table';
import Essentials from '@ckeditor/ckeditor5-essentials/src/essentials';
import LinkTarget from './LinkTargetPlugin';

export class Editor extends React.Component<any, any> {
    constructor(props: any) {
        super(props);
        this.state = {
            editorState: sanitizeHtml(props.content),
        }
    }
    
    componentDidMount() {
        const { content } = this.props;
        if (content) {
            this.setState({
                editorState: sanitizeHtml(content), 
            });
        }
    }

    handleEditorStateChange = (event, editor: any) => {
        const editorState = editor.getData();
        if (editorState !== this.state.editorState) {
            this.setState({
                editorState,
            });
    
            this.props.onContentChange(editorState); 
        }
    };

    render() {
        return (
            <CKEditor
                data={this.state.editorState}
                config={{
                    language: 'en',
                    plugins: [Essentials, LinkTarget, Autoformat, 
                        Heading, List, Paragraph, PasteFromOffice,
                        Table, FontSize, FontFamily, Bold, Italic, Strikethrough, Superscript],
                    toolbar: {
                        items: ['undo', 'redo', 'bold', 'italic', 'strikethrough', 'superscript', 'fontFamily', 'fontSize',
                        'link', 'heading', 'numberedList', 'bulletedList', 
                        'insertTable', 'tableColumn', 'tableRow', 'mergeTableCells']
                    }
                }}
                editor={ClassicEditor}
                onChange={this.handleEditorStateChange}
            />
        );
    }
}

export default Editor;
