import React from "react";
import { getPackage } from "../utils/unpkg.com.js";
import FileTree from "./FileTree/FileTree.jsx";
import { getQueryString } from "../utils/url.js";

export default class App extends React.Component {

	state = {
		cursor: null,
		data: {
			package: {},
			files: [{
				path: "Loading..."
			}]
		}
	};
	mounted = false;

	async componentDidMount () {

		let packageInfo;

		this.mounted = true;

		packageInfo = await getPackage(getQueryString().p);

		if (!this.mounted)
			return;

		if (packageInfo.error) {
			return this.setState({
				data: {
					package: {},
					files: [{
						path: packageInfo.error
					}]
				}
			});
		}

		this.setState({
			data: packageInfo
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
			<FileTree files={ this.state.data.files || [] }/>
		];
	}

}