import { get } from "./http.js";

const domain = `https://unpkg.com`;

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

	return {
		package: pkg || { name: "?" },
		files: meta ? (meta.files || []) : []
	};

}