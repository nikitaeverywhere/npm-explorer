import React from "react";
import { getIconForFile, getFileName, sortFiles } from "../../utils/fileOps.js";

export default class FileTree extends React.Component {

	render () {

		const files = sortFiles(this.props.files || []);

		return <ul className="file-tree">{ files.map(file =>
			<li className="item"
			    key={ file.path }>
				<div className={ `small icon ${ getIconForFile(file) }` }/>
				<div className="name">{ getFileName(file) }</div>
				{ !(file.files instanceof Array) ? null :
				<FileTree files={ file.files }/>
				}
			</li>
		) }</ul>

	}

}