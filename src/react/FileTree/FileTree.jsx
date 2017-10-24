import React from "react";
import { getIconForFile, getFileName, sortFiles } from "../../utils/fileOps.js";

export default class FileTree extends React.Component {

	state = {
		nonce: 0
	};

	onFileClick (file) {

		if (file.type !== "directory")
			return;

		file.opened = !file.opened;

		this.setState({
			nonce: this.state.nonce + 1
		});

	}

	render () {

		const files = sortFiles(this.props.files || []);

		return <ul className="file-tree">{ files.map(file =>
			<li className="item"
			    key={ file.path }>
				<div className="head"
				     onClick={ () => this.onFileClick(file) }>
					<div className={ `small icon ${ getIconForFile(file) }` }/>
					<div className="name">{ getFileName(file) }</div>
				</div>
				{ !file.opened || !(file.files instanceof Array) ? null :
				<FileTree files={ file.files }/>
				}
			</li>
		) }</ul>

	}

}