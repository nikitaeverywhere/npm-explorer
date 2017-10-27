import React from "react";
import { getIconForFile, getFileName, sortFiles } from "../../utils/fileOps.js";

export default class FileTree extends React.Component {

	state = {
		nonce: 0
	};

	onItemClick (item) {

		if (item.type !== "directory") {
			if (this.props.onFileSelect)
				this.props.onFileSelect(item);
			return;
		}

		item.opened = !item.opened;

		this.setState({
			nonce: this.state.nonce + 1
		});

	}

	render () {

		let { files, ...props } = this.props;

		files = sortFiles(files || []);

		return <ul className="file-tree">{ files.map(item =>
			<li className="item"
			    key={ item.path }>
				<div className="head"
				     onClick={ () => this.onItemClick(item) }>
					<div className={ `small icon ${ getIconForFile(item) }` }/>
					<div className="name">{ getFileName(item) }</div>
				</div>
				{ !item.opened || !(item.files instanceof Array) ? null :
				<FileTree files={ item.files } { ...props }/>
				}
			</li>
		) }</ul>

	}

}