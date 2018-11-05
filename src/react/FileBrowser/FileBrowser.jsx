import React from "react";
import { domain, getFile } from "../../utils/unpkg.com.js";
import { replaceUrlState, getQueryString } from "../../utils/url.js";
import AceEditor from "react-ace";
import "brace/ext/searchbox";
import "brace/mode/javascript";
import "brace/mode/jsx";
import "brace/mode/json";
import "brace/mode/text";
import "brace/theme/xcode";

function detectModeFromFileExtension (file) {
	if (/\.m?js/.test(file)) {
		return "javascript";
	} else if (/\.jsx/.test(file)) {
		return "jsx";
	} else if (/\.json/.test(file)) {
		return "json";
	} else {
		return "text";
	}
}

const encodeSelection = ([from, to]) => `${ from.row + 1 }:${ from.column }-${ to.row + 1 }:${ to.column }`;
const decodeSelection = (string) => {
	const [fromRow, fromColumn, toRow, toColumn] = string.split(/[-\:]/g);
	return [{ row: (+fromRow || 1) - 1, column: +fromColumn || 0 }, { row: (+toRow || 1) - 1, column: +toColumn || 0 }];
}

export default class FileBrowser extends React.Component {

	file = null;
	contents = new Map();
	aceEditorProps = {
		$blockScrolling: true
	}

	state = {
		nonce: 0,
		err: ""
	};
	aceEditor = null;

	onLoad = (aceEditor) => {
		this.aceEditor = aceEditor;
		this.aceEditor.setOptions({
			autoScrollEditorIntoView: true
		});
		this.updateSize();
		const [selectionFrom, selectionTo] = decodeSelection(getQueryString().selection || "");
		aceEditor.focus();
		aceEditor.gotoLine(selectionFrom.row, selectionFrom.column, true);
		aceEditor.selection.setSelectionRange({ start: selectionFrom, end: selectionTo }, false);
		aceEditor.scrollToLine(selectionFrom.row, true, false, () => {});
	}

	onSelectionChange = ({ anchor, lead }) => {
		replaceUrlState({
			selection: encodeSelection([anchor, lead])
		});
	}

	requestFile (file) {

		if (!file || !this.props.package)
			return null;

		if (file.contentType && file.contentType.indexOf("image") === 0)
			return this.getImageElement(file);

		getFile(`${ this.props.package.name }@${ this.props.package.version }`, file.path).then((text) => {
			this.contents.set(file.path, text);
			this.setState({
				err: "",
				nonce: this.state.nonce + 1
			});
		}).catch((e) => {
			this.contents.set(file.path, "Failed to load file: " + e);
			this.setState({
				err: "" + (e ? e.error || "" : e),
				nonce: this.state.nonce + 1
			});
		});

		return null;

	}

	getImageElement (file) {
		return <img className="image"
		            src={ domain + "/" + this.props.package.name + "/" + file.path }
		            alt="image"/>
	}

	updateSize () {
		if (this.aceEditor) {
			this.aceEditor.resize(true);
		}
	}

	render () {

		const file = this.props.file || null;
		const contents = this.contents.has(file.path)
			? this.contents.get(file.path)
			: this.requestFile(file);

		return <div className="file-browser">
			{ file && !contents
				? <div class="header">
					{ this.state.err ? this.state.err : "Loading..." }
				</div>
				: !file
					? <div/>
					: <AceEditor theme="xcode"
								 name="editor"
								 mode={ detectModeFromFileExtension(file.path) }
								 readOnly={ true }
								 onLoad={ this.onLoad }
								 value={ contents }
								 showPrintMargin={ false }
								 onSelectionChange={ this.onSelectionChange }
								 editorProps={ this.aceEditorProps }/> }
		</div>

	}

}