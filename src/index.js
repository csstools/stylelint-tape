import logUpdate from 'log-update';
import path from 'path';
import stylelint from 'stylelint';
import { bold, cyan, dim, green, red, white, yellow } from '../lib/colors';
import { trim, json } from '../lib/utils';
import { done, fail, wait } from '../lib/symbols';
import nodeOptions from '../lib/get-node-options';

export default (options, testsByRuleName) => {
	const normalizedopts = Object.assign({}, nodeOptions, options === Object(options)
		? options
	: { plugin: options });

	normalizedopts.plugin = path.resolve(normalizedopts.cwd, normalizedopts.plugin || '');

	// run tests by rule name
	return Object.keys(testsByRuleName).reduce(
		(p1, ruleName) => p1.then(
			() => testsByRuleName[ruleName].reduce(
				(p2, test) => p2.then(
					() => {
						const title = getTitleByTest(test);

						// update log for pending test
						logUpdate(`${dim(wait)} ${title}`);

						// run test and update log with results
						return runTest(ruleName, test, normalizedopts).then(
							() => logUpdate(`${green(done)} ${white(title)}`),
							error => logUpdate(`${red(fail)} ${bold(title)}\n ${yellow(trim(error.message))}`)
						).then(
							() => logUpdate.done()
						);
					}
				),
				Promise.resolve()
			)
		),
		Promise.resolve()
	);
};

const runTest = (ruleName, test, opts) => stylelint.lint({
	code: test.source,
	config: {
		plugins: [path.resolve(opts.cwd, opts.plugin)],
		rules: {
			[ruleName]: test.args || opts.defaultArgs
		}
	},
	fix: Boolean(test.expect)
}).then(results => {
	const warnings = results.results.reduce(
		(array, result) => array.concat(result.warnings),
		[]
	);

	if (typeof test.warnings === 'number' && test.warnings !== warnings.length) {
		throw new Error(`Expected ${test.warnings} warnings\nReceived ${warnings.length} warnings`);
	}

	if (test.expect && results.output !== test.expect) {
		throw new Error(`Expected: ${test.expect}\nRecieved: ${results.output}`);
	}
});

const getWarningsByTest = test => test.warnings instanceof Array
	? test.warnings.length
: typeof test.warnings === 'number'
	? test.warnings
: 0;

const getargsByTest = test => test.args ? ` with ${green(json(test.args))}` : ''

const getTitleByTest = test => 'title' in test
	? test.title
: 'expect' in test
	? `${cyan(test.source)}${getargsByTest(test)} becomes ${cyan(test.expect)}`
: `${cyan(test.source)}${getargsByTest(test)} reports ${yellow(String(getWarningsByTest(test)))} warning${getWarningsByTest(test) === 1 ? '' : 's'}`;
