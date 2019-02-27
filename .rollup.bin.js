import babel from 'rollup-plugin-babel';

export default {
	input: 'src/bin.js',
	output: [
		{ file: 'bin.js', format: 'cjs', sourcemap: true }
	],
	plugins: [
		babel({
			presets: [
				['@babel/env', {
					loose: true,
					modules: false,
					targets: { node: 6 },
					useBuiltIns: 'entry'
				}]
			]
		}),
		addHashBang()
	]
};

function addHashBang() {
	return {
		name: 'add-hash-bang',
		renderChunk(code) {
			return `#!/usr/bin/env node\n${code}`;
		}
	};
}
