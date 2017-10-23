export function getIconForFile (file) {

	if (file.children)
		return "folder";

	return "file";

}