import loadTar from "./file-loader.js";
import untar from "js-untar";
import { inflate } from "pako/lib/inflate.js";

export default function extract (url, callback) {
	loadTar(url, (buf) => {
		try {
			untar(inflate(buf).buffer).then((files) => {
				callback(files);
			});
		} catch (e) {
			callback([]);
		}
	});
}