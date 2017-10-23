function sortTree (root) {

	if (!root.children || root.children.length === 0)
		return;

	root.children.sort((a, b) => {
		if (a.children && !b.children)
			return -1;
		if (b.children && !a.children)
			return 1;
		return a.name > b.name ? 1 : a.name < b.name ? -1 : 0
	});

	for (const r of root.children) {
		sortTree(r);
	}

}

export default function formFileTree (rootName, files) {

	const root = {
		name: rootName,
		children: []
	};

	for (const file of files) {

		let obj = root;
		const name = file.name.split(/\//g);

		if (name[0] !== "package") // tar can optionally have paxHeader folder inside
			continue;

		for (let i = 1; i < name.length - 1; ++i) {

			let tChild = null;
			for (const child of obj.children) {
				if (child.name === name[i]) {
					tChild = child;
				}
			}
			if (tChild) {
				obj = tChild;
				continue;
			}

			const temp = {
				name: name[i],
				children: []
			};
			obj.children.push(temp);
			obj = temp;
		}

		obj.children.push({
			name: name[name.length - 1],
			file: file
		});

	}

	sortTree(root);

	return root;

}