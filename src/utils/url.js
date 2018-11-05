import { parse } from "querystringify";

export function getQueryString () {

	return parse(location.search);

}

export function replaceUrlState ({ p, selection }) {
	let state = `${ window.location.pathname }${ window.location.search }`;
	if (p) {
		state = state.replace(/([?&])p=[^\&]+|$/, (_, s) => `${ s || "?" }p=${ p }`);
	}
	if (selection) {
		state = state.replace(/([?&])selection=[^\&]+|$/, (_, s) => `${ s || "&" }selection=${ selection }`);
	}
	return window.history.replaceState({}, document.title, state);
}