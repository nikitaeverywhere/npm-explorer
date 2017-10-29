import React from "react";
import { getPackage } from "../utils/unpkg.com.js";
import FileTree from "./FileTree/FileTree.jsx";
import { getQueryString } from "../utils/url.js";
import FileBrowser from "./FileBrowser/FileBrowser.jsx";
import { getFileName } from "../utils/fileOps.js";

const getAuthorElement = (packageAuthor) => {

	if (!packageAuthor)
		return "";

	if (typeof packageAuthor === "string")
		return packageAuthor;

	if (packageAuthor.name)
		return packageAuthor.url || packageAuthor.email
			? <a href={ packageAuthor.url || packageAuthor.email }>{ packageAuthor.name }</a>
			: packageAuthor.name;

	if (packageAuthor instanceof Array)
		return "multiple authors";

	return "";

};

export default class App extends React.Component {

	state = {
		cursor: null,
		data: {
			package: {},
			files: [{
				path: "Loading..."
			}]
		},
		selectedFile: null,
		nonce: 0
	};
	mounted = false;
	windowSizeChangeListener = null;

	async componentDidMount () {

		let packageInfo;

		this.mounted = true;

		if (!this.windowSizeChangeListener)
			window.addEventListener(
				"resize",
				this.windowSizeChangeListener = () => this.onWindowSizeChange()
			);

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
		if (this.windowSizeChangeListener) {
			window.removeEventListener("resize", this.windowSizeChangeListener);
			this.windowSizeChangeListener = null;
		}
	}

	onWindowSizeChange () {
		this.setState({
			nonce: this.state.nonce + 1
		});
	}

	render () {

		const layout = window.innerWidth > window.innerHeight
			? "desktop"
			: "mobile";
		const author = getAuthorElement(this.state.data.package.author);

		return <div className={
				`layout layout-${ layout } ${ this.state.selectedFile ? "file-selected" : "" }`
			}>
			<div className="header">
				<div className="top">
					<span className="name">{ this.state.data.package.name || "Loading..." }</span>
					&nbsp;
					<span className="author">
						{ author ? `by ${ author }` : "" }
					</span>
				</div>
			</div>
			<div className="col1">
				<FileTree files={ this.state.data.files || [] }
				          layout={ layout }
				          onFileSelect={ (f) => this.setState({ selectedFile: f }) }/>
			</div>
			<div className="col2">
				<div className="close-button"
				     onClick={ () => this.setState({ selectedFile: null }) }/>
				{ this.state.selectedFile ? <div className="file-name">{
					getFileName(this.state.selectedFile)
				}</div> : null }
				{ !this.state.selectedFile ? null :
				<FileBrowser package={ this.state.data.package }
				             layout={ layout }
					         file={ this.state.selectedFile }/>
				}
			</div>
		</div>

	}

}