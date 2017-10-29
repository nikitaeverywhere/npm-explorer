import React from "react";
import { getIconForFile, getFileName, sortFiles } from "../../utils/fileOps.js";
import { getReadableSize, colorCodeItem } from "../../utils/etc.js";

export default class FileTree extends React.Component {

	state = {
		nonce: 0,
		path: [ /* path, to, dir */ ]
	};

	onItemClick (item) {

		if (item.path === "..") {
			this.state.path.pop();
			this.setState({
				nonce: this.state.nonce + 1
			});
			return;
		}

		if (item.type !== "directory") {
			if (this.props.onFileSelect)
				this.props.onFileSelect(item);
			return;
		}

		if (this.props.layout === "mobile") {
			this.setState({
				nonce: this.state.nonce + 1,
				path: this.state.path.concat( getFileName(item) )
			});
		} else {
			item.opened = !item.opened;
			this.setState({
				nonce: this.state.nonce + 1
			});
		}

	}

	render () {

		let { files, ...props } = this.props;

		for (let dir of this.state.path) {
			for (let file of files) {
				if (getFileName(file) === dir && file.files instanceof Array) {
					files = file.files;
					break;
				}
			}
		}

		files = sortFiles((files || []).slice());
		if (this.state.path.length) {
			files.unshift({
				path: "..",
				name: "/" + this.state.path.join("/") + "/..",
				files: [],
				type: "directory"
			});
		}

		return <ul className="file-tree">{ files.map(item =>
			<li className="item"
			    key={ item.path }>
				<div className="head"
				     onClick={ () => this.onItemClick(item) }>
					<div className={ `small icon ${ getIconForFile(item) }` }/>
					<div className="size"
					     style={ { color: colorCodeItem(item, this.props.data) } }>
						{ item.size ? getReadableSize(item.size) : "" }
					</div>
					<div className="name">{ item.name || getFileName(item) }</div>
				</div>
				{ !item.opened || !(item.files instanceof Array) || this.props.layout === "mobile"
					? null :
				<FileTree files={ item.files } { ...props }/>
				}
			</li>
		) }</ul>

	}

}