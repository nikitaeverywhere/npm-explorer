import { get } from "./http.js";

const domain = `https://unpkg.com`;

export async function getPackage (packageName) {

	const filesUrl = `${ domain }/${packageName}/?meta`;
	const packageUrl = `${ domain }/${packageName}/package.json`;

	try {

		const [ pkg, meta ] = await Promise.all([
			new Promise((yes, no) => get(packageUrl, (err, data) => err ? no(err) : yes(data))),
			new Promise((yes, no) => get(filesUrl, (err, data) => err ? no(err) : yes(data)))
		]);

		return {
			package: pkg || { name: "?" },
			files: meta ? (meta.files || []) : []
		};

	} catch (e) {

		return {
			error: e
		};

	}

}