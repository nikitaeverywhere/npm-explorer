import React from "react";
import { Treebeard } from "react-treebeard";
import extract from "../utils/extract.js";
import transformFiles from "../utils/formFileTree.js";

export default class App extends React.Component {

	state = {
		cursor: null,
		tree: {
			name: "loading..."
		}
	};

	constructor (props) {
		super(props);
		//"https://registry.npmjs.org/react-xmasonry/-/react-xmasonry-2.5.2.tgz"
		extract("https://registry.npmjs.org/react-xmasonry/-/react-xmasonry-2.5.2.tgz", (files) => {
			this.setState({
				tree: transformFiles(files)
			})
		});
	}

	onToggle (node, toggled) {
		if(this.state.cursor){this.state.cursor.active = false;}
		node.active = true;
		if(node.children){ node.toggled = toggled; }
		this.setState({ cursor: node });
	}

	render () {
		console.log("render");
		return [
			<div style={{ textAlign: "center" }}>
				This service is under development right now. <br/>
				By the way, you can check react-xmasonry package right now:
			</div>,
			<Treebeard onToggle={ this.onToggle.bind(this) }
			           data={ this.state.tree }/>
		];
	}

}