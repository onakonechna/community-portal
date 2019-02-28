import * as React from 'react';
import sanitizeHtml from 'sanitize-html';
import CKEditor from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-editor-classic/src/classiceditor';
import FontSize from '@ckeditor/ckeditor5-font/src/font';
import FontFamily from '@ckeditor/ckeditor5-font/src/fontfamily';
import Autoformat from '@ckeditor/ckeditor5-autoformat/src/autoformat';
import Heading from '@ckeditor/ckeditor5-heading/src/heading';
import List from '@ckeditor/ckeditor5-list/src/list';
import Paragraph from '@ckeditor/ckeditor5-paragraph/src/paragraph';
import PasteFromOffice from '@ckeditor/ckeditor5-paste-from-office/src/pastefromoffice';
import Table from '@ckeditor/ckeditor5-table/src/table';
import Essentials from '@ckeditor/ckeditor5-essentials/src/essentials';
import Link from '@ckeditor/ckeditor5-link/src/link';

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
                    plugins: [Essentials, Link, Autoformat, 
                        Heading, List, Paragraph, PasteFromOffice, Table, FontSize, FontFamily],
                    toolbar: {
                        items: ['undo', 'redo', 'fontFamily', 'fontSize', 
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
