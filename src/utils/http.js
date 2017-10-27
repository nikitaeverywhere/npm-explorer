export function get (url, as, callback) {

	const xmlhttp = new XMLHttpRequest();

	if (typeof as === "function") {
		callback = as;
		as = null;
	}

	xmlhttp.onreadystatechange = function () {
		if (this.readyState === 4) {

			const contentType = xmlhttp.getResponseHeader("content-type") || "";
			let res;

			if (as === "text") {
				res = this.responseText;
			} else if (contentType.indexOf("application/json") === 0) try {
				res = JSON.parse(this.responseText);
			} catch (e) {} else {
				res = this.responseText;
			}
			if (this.status === 200)
				callback(null, res, this.responseURL);
			else if (this.status === 404)
				callback("Package not found");
			else
				callback("NPM returned a status " + this.status);

		}
	};

	xmlhttp.open("GET", url, true);
	xmlhttp.send();

}