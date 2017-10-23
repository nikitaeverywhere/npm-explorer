import loadTar from "./file-loader.js";
import untar from "js-untar";
import { inflate } from "pako/lib/inflate.js";

export default function extract (url, callback) {
	loadTar(url, (err, buf) => {
		if (err)
			return callback(err);
		try {
			untar(inflate(buf).buffer).then((files) => {
				callback(null, files);
			});
		} catch (e) {
			callback("Unable to decompress file " + url);
		}
	});
}