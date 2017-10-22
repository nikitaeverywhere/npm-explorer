import React from "react";
import ReactDom from "react-dom";
import App from "./react/App.jsx";
import domLoaded from "dom-loaded";

domLoaded.then(() => {
	ReactDom.render(<App/>, document.getElementById("root"));
});