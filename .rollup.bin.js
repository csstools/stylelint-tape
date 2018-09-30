import babel from 'rollup-plugin-babel';

export default {
	input: 'src/bin.js',
	output: [
		{ file: 'bin.js', format: 'cjs', sourcemap: true }
	],
	plugins: [
		babel({
			presets: [
				['@babel/env', { modules: false, targets: { node: 6 } }]
			]
		})
	]
};
