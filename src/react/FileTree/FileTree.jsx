import React from "react";
import { getIconForFile } from "../../utils/icons.js";

export default class FileTree extends React.Component {

	render () {

		const files = this.props.files || [];

		return <ul className="file-tree">{ files.map(file =>
			<li className="item"
			    key={ file.name }>
				<div className={ `small icon ${ getIconForFile(file) }` }/>
				<div className="name">{ file.name }</div>
				{ !file.children ? null :
				<FileTree files={ file.children }/>
				}
			</li>
		) }</ul>

	}

}