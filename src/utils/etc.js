export const getReadableSize = (size) => {

	const order = Math.floor(Math.log10(size || 1) / 3);
	const value = size === 0 ? size : size / Math.pow(1000, order);

	return `${ Math.round(value * 100) / 100 }${
		order === 0 ? "B"
		: order === 1 ? "kB"
		: order === 2 ? "MB"
		: order === 3 ? "GB"
		: order === 3 ? "TB"
		: ":P"
	}`;

};

export const colorCodeItem = (item = {}, { totalSize, totalFiles /*, totalDirs */ } = {}) => {

	let pct,
		size = item.size;

	if (item.type === "directory") {
		size = item.files && item.files.length
			? item.files.map(f => f.size || 0).reduce((a, b) => Math.max(a, b))
			: item.size;
	}

	pct = Math.min(Math.pow(size / ( totalSize / totalFiles ), 0.2), 2) / 2;

	return `rgb(${ Math.round(255 * pct) },${ Math.round((255 * (100 - pct * 100)) / 100) },0)`;

};

const blacklisted = [
	"/node_modules",
	"/.jshintrc",
	"/.eslintrc",
	"/eslint.json",
	"/.babelrc",
	"/.lint",
	"/.lvimrc",
	"/.travis.yml",
	"/.jenkins.yml",
	"/test",
	"/.npmignore",
	"/karma.conf.js",
	"/gulpfile.js",
	"/gulpfile.babel.js",
	"/gruntfile.js",
	"/webpack.config.js",
	"/.idea",
	"/project-name.iml",
	"/.vscode"
];

export function isBlacklisted (item) {
	return (blacklisted.indexOf(item.path.toLowerCase()));
};