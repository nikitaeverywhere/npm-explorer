import React from "react";
import ReactDom from "react-dom";
import App from "./react/App.jsx";
import domLoaded from "dom-loaded";
import { getQueryString } from "./utils/url.js";

function initialize () {
	ReactDom.render(<App/>, document.getElementById("root"));
}

domLoaded.then(() => {

	const queryString = getQueryString();

	if (queryString.p) {
		return initialize();
	}

	const form = document.getElementById("welcome-form");

	form.addEventListener("submit", (event) => {

		event.preventDefault();

		const packageName = form.elements["package-name"].value;

		if (!packageName)
			return;

		location.href = "?p=" + packageName;
		initialize();

	});

});