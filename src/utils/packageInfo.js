import extract from "../utils/extract.js";
import transformFiles from "../utils/formFileTree.js";

const registryUrl = `https://registry.npmjs.org`;

function get (url, callback) {

	const xmlhttp = new XMLHttpRequest();

	xmlhttp.onreadystatechange = function () {
		if (this.readyState === 4) {
			let myArr;
			try {
				myArr = JSON.parse(this.responseText);
			} catch (e) {}
			if (this.status === 200) callback(myArr || {
				error: "Unable to parse response from NPM: " + this.responseText
			}); else if (this.status === 404) callback({
				error: "Package is not on NPM"
			}); else callback({
				error: "Cannot get package: NPM returned a status " + this.status
			});
		}
	};

	xmlhttp.open("GET", url, true);
	xmlhttp.send();
	
}

function parsePackageDefinition (pkg, callback) {

	// Currently (as of Nov 2017) only the "search" endpoint supports cross-origin requests.
	// Because of it, there is a need to form tar URL manually.
	const scoped = pkg.name[0] === "@";
	const tarUrl = `https://registry.npmjs.org/${ pkg.name }/-/${
		scoped ? pkg.name.replace(/^[^/]*\//, "") : pkg.name }-${ pkg.version }.tgz`;

	extract(tarUrl, (err, files) => {

		if (err)
			return callback(err);

		if (!files || files.length === 0)
			return callback(
				"Unable to unpack tar archive from NPM :( Please, report this URL: " + tarUrl
			);

		console.log(files);

		callback(null, {
			pkg: pkg,
			filesTree: transformFiles(pkg.name, files)
		});

	});

}

export default async function getInfo (packageName) { return new Promise((resolve, reject) => {

	get(
		// Currently (as of Nov 2017) only the "search" endpoint supports cross-origin requests
		`${ registryUrl }/-/v1/search?text=${ packageName }&size=1`,
		(response) => {

			if (response.error)
				return reject(response.error);

			if (
				!response["objects"]
				|| !response["objects"][0]
				|| !response["objects"][0]["package"]
				|| response["objects"][0]["package"]["name"] !== packageName
			)
				return reject(`Package ${ packageName } not found`);

			parsePackageDefinition(response["objects"][0]["package"], (err, data) => {
				if (err)
					reject(err);
				resolve(data);
			});

		}
	);
	
})}