import React from "react";
import getInfo from "../utils/packageInfo.js";
import FileTree from "./FileTree/FileTree.jsx";

export default class App extends React.Component {

	state = {
		cursor: null,
		fileTree: [{
			name: "loading..."
		}]
	};
	mounted = false;

	async componentDidMount () {

		let packageInfo;

		this.mounted = true;

		try {
			packageInfo = await getInfo(location.hash.slice(1));
			console.log(packageInfo);
		} catch (e) {
			return this.setState({
				fileTree: [{
					name: e
				}]
			});
		}

		this.setState({
			fileTree: packageInfo.filesTree
		});

	}

	componentWillUnmount () {
		this.mounted = false;
	}

	render () {
		return [
			<div style={{ textAlign: "center" }}>
				This service is under active development right now.
			</div>,
			<FileTree files={ this.state.fileTree }/>
		];
	}

}