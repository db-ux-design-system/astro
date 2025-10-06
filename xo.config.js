import ignoreFolders from './.config/ignores.js';

/** @type {import('xo').FlatXoConfig} */
const xoConfig = [
	{ ignores: [...ignoreFolders] },
];

export default xoConfig;
