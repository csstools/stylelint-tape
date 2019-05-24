import babel from 'rollup-plugin-babel';

const isCLI = String(process.env.NODE_ENV).includes('cli');
const input = isCLI ? 'src/cli.js' : 'src/index.js';
const output = isCLI
	? { file: 'cli.js', format: 'cjs', sourcemap: true, strict: false }
: [
	{ file: 'index.js', format: 'cjs', sourcemap: true, strict: false },
	{ file: 'index.mjs', format: 'esm', sourcemap: true, strict: false }
];

export default {
	input,
	output,
	plugins: [
		babel({
			presets: [
				['@babel/env', {
					corejs: 3,
					loose: true,
					modules: false,
					targets: { node: 8 },
					useBuiltIns: 'entry'
				}]
			]
		})
	].concat(
		isCLI ? addHashBang()
		: []
	)
};

function addHashBang () {
	return {
		name: 'add-hash-bang',
		renderChunk (code) {
			return `#!/usr/bin/env node\n${code}`;
		}
	};
}
