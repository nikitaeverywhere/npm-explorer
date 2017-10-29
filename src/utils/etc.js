export const getReadableSize = (size) => {

	const order = Math.floor(Math.log10(size || 1) / 3);
	const value = size === 0 ? size : size / Math.pow(1000, order);

	return `${ Math.round(value * 100) / 100 }${
		order === 0 ? "B"
		: order === 1 ? "kB"
		: order === 2 ? "MB"
		: order === 3 ? "GB"
		: order === 3 ? "TB"
		: ":P"
	}`;

};