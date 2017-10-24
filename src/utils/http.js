export function get (url, callback) {

	const xmlhttp = new XMLHttpRequest();

	xmlhttp.onreadystatechange = function () {
		if (this.readyState === 4) {
			let res;
			try {
				res = JSON.parse(this.responseText);
			} catch (e) {}
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