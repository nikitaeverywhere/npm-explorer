import { parse } from "querystringify";

export function getQueryString () {

	return parse(location.search);

}