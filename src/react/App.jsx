import React from "react";
import { getPackage } from "../utils/unpkg.com.js";
import FileTree from "./FileTree/FileTree.jsx";
import { getQueryString } from "../utils/url.js";
import FileBrowser from "./FileBrowser/FileBrowser.jsx";
import { openTreeToFile } from "../utils/fileOps.js";
import { getReadableSize } from "../utils/etc.js";

const getAuthorElement = (packageAuthor) => {

	if (!packageAuthor)
		return "";

	if (typeof packageAuthor === "string")
		return packageAuthor;

	if (packageAuthor.name)
		return packageAuthor.url || packageAuthor.email
			? <a href={
			     	packageAuthor.url
			     		? packageAuthor.url.indexOf("http") === 0
			     			? packageAuthor.url
			     			: `http://${ packageAuthor.url }`
			     		: `mailto:${ packageAuthor.email }`
			     }
			     target="_blank">
				{ packageAuthor.name }
			</a>
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
			}],
			totalSize: 0,
			totalFiles: 0,
			totalDirs: 0
		},
		selectedFile: null,
		nonce: 0
	};
	mounted = false;
	windowSizeChangeListener = null;
	fileBrowser = null;

	async componentDidMount () {

		let packageInfo,
		    packageName = getQueryString().p || "",
		    path = [];
		const scoped = packageName[0] === "@";

		this.mounted = true;

		if (!this.windowSizeChangeListener)
			window.addEventListener(
				"resize",
				this.windowSizeChangeListener = () => this.onWindowSizeChange()
			);

		const slashes = (packageName.match(/\//g) || []).length;
		if (scoped && slashes > 1) {
			const arr = packageName.split(/\//g);
			packageName = arr.slice(0, 2).join("/");
			path = "/" + arr.slice(2).join("/");
		} else if (!scoped && slashes > 0) {
			const arr = packageName.split(/\//g);
			packageName = arr.slice(0, 1).join("/");
			path = "/" + arr.slice(1).join("/");
		}

		packageInfo = await getPackage(packageName);
		document.title = `NPM Explorer: ${ packageName }`;

		if (!this.mounted)
			return;

		if (packageInfo.error) {
			return this.setState({
				data: Object.assign({}, this.state.data, {
					package: {},
					files: [{
						path: packageInfo.error
					}]
				})
			});
		}

		const selectedFile = path.length > 0
			? openTreeToFile(packageInfo.files || [], path)
			: null;

		this.setState({
			data: packageInfo,
			selectedFile: selectedFile
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
		if (this.fileBrowser) {
			this.fileBrowser.updateSize();
		}
	}

	onFileSelect (file) {

		if (file === this.state.selectedFile)
			return;

		window.history.replaceState({}, document.title, `?p=${ this.state.data.package.name }@${ this.state.data.package.version }${
			file 
				? file.path || ""
				: ""
		}`);

		this.setState({ selectedFile: file });

	}

	fileBrowserRef = (fileBrowser) => {
		this.fileBrowser = fileBrowser;
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
				<a href="https://github.com/ZitRos/npm-explorer/blob/master/readme.md"
				   target="_blank"
				   className="logo-container">
					<img className="logo" src="img/favicon.png"/>
				</a>
				<div className="top">
					<span className="name">
						<a target="_blank"
						   href={ `https://www.npmjs.com/package/${ this.state.data.package.name }` }>
							{ this.state.data.package.name || "Loading..." }
						</a>@{ this.state.data.package.version || "..." }
					</span>
					&nbsp;
					<span className="author">
						{ author ? <span>by { author }</span> : null }
					</span>
				</div>
				<div className="body">
					<span className="size">
						{ getReadableSize(this.state.data.totalSize) } in total.
					</span>
					&nbsp;
					<span className="desc">
						{ this.state.data.package.description || "" }
					</span>
				</div>
			</div>
			<div className="col1">
				<FileTree files={ this.state.data.files || [] }
				          layout={ layout }
				          data={ this.state.data }
				          selectedFile={ this.state.selectedFile }
				          onFileSelect={ (f) => this.onFileSelect(f) }/>
			</div>
			<div className="col2">
				<div className="head">
					<div className="close-button"
					     onClick={ () => this.onFileSelect(null) }/>
					{ this.state.selectedFile ? <div className="file-name">{
						this.state.selectedFile.path
					}</div> : null }
				</div>
				{ !this.state.selectedFile ? null :
				<FileBrowser package={ this.state.data.package }
				             layout={ layout }
					         file={ this.state.selectedFile }
							 ref={ this.fileBrowserRef }/>
				}
			</div>
		</div>

	}

}