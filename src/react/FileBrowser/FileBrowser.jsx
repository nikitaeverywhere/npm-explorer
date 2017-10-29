import React from "react";
import { domain, getFile } from "../../utils/unpkg.com.js";

export default class FileBrowser extends React.Component {

	file = null;
	contents = new Map();

	state = {
		nonce: 0,
		err: ""
	};

	requestFile (file) {

		if (!file || !this.props.package)
			return null;

		if (file.contentType && file.contentType.indexOf("image") === 0)
			return this.getImageElement(file);

		getFile(this.props.package.name, file.path).then((text) => {
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

	render () {

		const file = this.props.file || null;
		const contents = this.contents.has(file.path)
			? this.contents.get(file.path)
			: this.requestFile(file);

		return <div className="file-browser">{ file && !contents
			?
			<div>
				{ this.state.err ? this.state.err : "Loading..." }
			</div>
			: !file ?
			<div/>
			:
			<div>
				{ contents }
			</div> }
		</div>

	}

}