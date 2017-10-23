import React from "react";
import { Treebeard } from "react-treebeard";
import getInfo from "../utils/packageInfo.js";

export default class App extends React.Component {

	state = {
		cursor: null,
		tree: {
			name: "loading..."
		}
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
				tree: {
					name: e
				}
			});
		}

		this.setState({
			tree: packageInfo.filesTree
		});

	}

	componentWillUnmount () {
		this.mounted = false;
	}

	onToggle (node, toggled) {
		if(this.state.cursor){this.state.cursor.active = false;}
		node.active = true;
		if(node.children){ node.toggled = toggled; }
		this.setState({ cursor: node });
	}

	render () {
		return [
			<div style={{ textAlign: "center" }}>
				This service is under active development right now.
			</div>,
			<Treebeard onToggle={ this.onToggle.bind(this) }
			           data={ this.state.tree }/>
		];
	}

}