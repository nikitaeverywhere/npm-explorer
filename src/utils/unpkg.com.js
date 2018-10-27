import { get } from "./http.js";
import { isBlacklisted } from "./etc.js";

export const domain = `https://unpkg.com`;

/**
 * Corrects sizes of directories and returns total size of a package.
 * @param item
 * @returns {number[]}
 */
const indexPackageSize = (item) => {

	let size = 0,
	    files = 0,
	    dirs = 0;

	item.trash = isBlacklisted(item);

	if (item.type === "directory") {
		if (item.files instanceof Array) {
			for (let file of item.files) {
				const [s, f, d] = indexPackageSize(file);
				size += s;
				files += f;
				dirs += d;
			}
		}
		item.size = size;
	} else {
		return [ item.size, 1, 0 ];
	}

	return [ size, files, 1 ];

};

export async function getPackage (packageName) {

	const filesUrl = `${ domain }/${packageName}/?meta`;
	const packageUrl = `${ domain }/${packageName}/package.json`;

	let meta, pkg;

	try {
		meta = await new Promise((yes, no) => get(filesUrl, (err, data, postUrl) => {
			if (err)
				return no(err);
			if (data && data.files && data.files.length > 0)
				return yes(data);
			// possible bug in unpkg: sometimes files are not served
			// https://github.com/unpkg/unpkg/issues/69#issuecomment-338967009
			setTimeout(() => {
				get(
					postUrl + (filesUrl.indexOf("?") === -1 ? "?" : "&") + "ts=" + Date.now(),
					(err, data) => err ? no(err) : yes(data)
				);
			}, 200); // artificial delay
			console.log(`Ducking into ${ packageName }...`);
		}));
	} catch (e) {
		return {
			error: e
		};
	}

	try {
		pkg = await new Promise(
			(yes, no) => get(packageUrl, (err, data) => err ? no(err) : yes(data))
		);
	} catch (e) {
		return {
			error: e
		};
	}

	const stats = indexPackageSize(meta);

	return {
		package: pkg || { name: "?" },
		files: meta ? (meta.files || []) : [],
		totalSize: stats[0],
		totalFiles: stats[1],
		totalDirs: stats[2]
	};

}

/**
 *
 * @param {string} packageName
 * @param {string} filePath - For example, "/LICENSE"
 * @return {Promise.<void>}
 */
export async function getFile (packageName, filePath) { return new Promise((resolve, reject) => {

	const url = `${ domain }/${packageName}${ filePath }`;

	get(url, "text", (err, res) => {

		if (err)
			reject(err);

		resolve(res);

	});

})}