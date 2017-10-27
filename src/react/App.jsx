import React from "react";
import { getPackage } from "../utils/unpkg.com.js";
import FileTree from "./FileTree/FileTree.jsx";
import { getQueryString } from "../utils/url.js";
import FileBrowser from "./FileBrowser/FileBrowser.jsx";

export default class App extends React.Component {

	state = {
		cursor: null,
		data: {
			package: {},
			files: [{
				path: "Loading..."
			}]
		},
		selectedFile: null
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

		const layout = window.innerWidth > window.innerHeight
			? "desktop"
			: "mobile";

		return <div className={ `layout layout-${ layout }` }>
			<div className="col1">
				<FileTree files={ this.state.data.files || [] }
				          layout={ layout }
				          onFileSelect={ (f) => this.setState({ selectedFile: f }) }/>
			</div>
			<div className="col2">
				{ !this.state.selectedFile ? null :
				<FileBrowser package={ this.state.data.package }
					         file={ this.state.selectedFile }/>
				}
			</div>
		</div>

	}

}