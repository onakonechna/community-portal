import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import LinkUI from '@ckeditor/ckeditor5-link/src/linkui';
import LinkEditing from '@ckeditor/ckeditor5-link/src/linkediting';
import { downcastAttributeToElement } from '@ckeditor/ckeditor5-engine/src/conversion/downcast-converters';
import { upcastElementToAttribute } from '@ckeditor/ckeditor5-engine/src/conversion/upcast-converters';
import LinkCommand from '@ckeditor/ckeditor5-link/src//linkcommand';
import UnlinkCommand from '@ckeditor/ckeditor5-link/src//unlinkcommand';
import { createLinkElement, ensureSafeUrl } from '@ckeditor/ckeditor5-link/src/utils';
import bindTwoStepCaretToAttribute from '@ckeditor/ckeditor5-engine/src/utils/bindtwostepcarettoattribute';

function createLinkTargetElement( href, writer ) {
    const linkElement = createLinkElement(href, writer);
    writer.setAttribute( 'target', '_blank', linkElement );

	return linkElement;
}

class LinkTargetEditing extends LinkEditing {
    editor: any;

	init() {
        const editor = this.editor;
        
		editor.model.schema.extend( '$text', { allowAttributes: 'linkHref' } );

		editor.conversion.for( 'dataDowncast' )
			.add( downcastAttributeToElement( { model: 'linkHref', view: createLinkTargetElement } ) );

		editor.conversion.for( 'editingDowncast' )
			.add( downcastAttributeToElement( { model: 'linkHref', view: ( href, writer ) => {
				return createLinkTargetElement( ensureSafeUrl( href ), writer );
			} } ) );

		editor.conversion.for( 'upcast' )
			.add( upcastElementToAttribute( {
				view: {
					name: 'a',
					attributes: {
						href: true
					}
				},
				model: {
					key: 'linkHref',
					value: viewElement => viewElement.getAttribute( 'href' )
				}
			} ) );

		editor.commands.add( 'link', new LinkCommand( editor ) );
		editor.commands.add( 'unlink', new UnlinkCommand( editor ) );

		bindTwoStepCaretToAttribute( editor.editing.view, editor.model, this, 'linkHref' );

		super._setupLinkHighlight();
	}
}

export default class LinkTarget extends Plugin {
    static get requires() {
		return [ LinkTargetEditing, LinkUI ];
	}

	static get pluginName() {
		return 'Link';
    }
}
