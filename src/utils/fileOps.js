export function getIconForFile (file) {

	if (file.type === "directory" || file.files instanceof Array)
		return "folder";

	return "file";

}

export function getFileName (file) {

	const name = file.path.match(/\/?([^/]*)$/) || [];

	return name[1] || "???";

}

export function sortFiles (files) {

	if (files.length === 0)
		return files;

	files.sort((a, b) => {
		if (a.files && !b.files)
			return -1;
		if (b.files && !a.files)
			return 1;
		return a.path > b.path ? 1 : a.path < b.path ? -1 : 0
	});

	return files;

}