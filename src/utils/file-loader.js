export default function load (source, callback) {

	const req = new XMLHttpRequest();
	req.overrideMimeType('text\/plain; charset=x-user-defined');
	req.open("GET", source, true);
	req.responseType = "arraybuffer";

	req.onload = function () {
		callback(req.response || []); // not oReq.responseText
	};

	req.send(null);

}