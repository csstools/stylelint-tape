import logUpdate from 'log-update';
import path from 'path';
import stylelint from 'stylelint';
import { bold, cyan, dim, green, red, white, yellow } from '../lib/colors';
import { trim, json } from '../lib/utils';
import { done, fail, wait } from '../lib/symbols';
import nodeOptions from '../lib/get-node-options';

export default async (options, testsByRuleName) => {
	let errorsCount = 0

	const normalizedopts = Object.assign({}, nodeOptions, options === Object(options)
		? options
	: { plugin: options });

	normalizedopts.plugin = path.resolve(normalizedopts.cwd, normalizedopts.plugin || '');

	// run tests by rule name
	async function runAllTests() {
		return Object.keys(testsByRuleName).reduce(
			(p1, ruleName) => p1.then(
				() => testsByRuleName[ruleName].reduce(
					(p2, test) => p2.then(
						() => {
							const title = getTitleByTest(test);

							// update log for pending test
							logUpdate(`${dim(wait)} ${title}`);

							// run test and update log with results
							return runTest(ruleName, test, normalizedopts, errorsCount).then(
								() => logUpdate(`${green(done)} ${white(title)}`),
								error => {
									// update error count in case there is errors
									errorsCount++
									logUpdate(`${red(fail)} ${bold(title)}\n ${yellow(trim(error.message))}`)
								}
							).then(
								() => {
									logUpdate.done()
								}
							);
						}
					),
					Promise.resolve()
				)
			),
			Promise.resolve()
		)
	};

	await runAllTests()

	if (errorsCount === 0) {
		return Promise.resolve()
	} else {
		return Promise.reject(Error('Tests failed.'))
	}
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
		errorsCount++
		// throw when the warning length by number does not match
		throw new Error(`Expected ${test.warnings} warnings\nReceived ${warnings.length} warnings`);
	} else if (Array.isArray(test.warnings)) {
		if (test.warnings.length !== warnings.length) {
			errorsCount++
			// throw when the warning length by array does not match
			throw new Error(`Expected ${test.warnings.length} warnings\nReceived ${warnings.length} warnings`);
		} else {
			test.warnings.forEach(
				(warningEntry, warningIndex) => {
					if (typeof warningEntry === 'string') {
						if (warningEntry !== warnings[warningIndex].text) {
							errorsCount++
							// throw when the warning text does not match
							throw new Error(`Expected warning: "${warningEntry}"\nRecieved warning: "${warnings[warningIndex].text}"`);
						}
					} else {
						Object.keys(Object(warningEntry)).forEach(warningKey => {
							if (warnings[warningIndex][warningKey] === warningEntry[warningKey]) {
								errorsCount++
								// throw when the warning key-value pair does not match
								throw new Error(`Expected: "${warningKey}" as ${warnings[warningIndex][warningKey]}\nRecieved: ${warningEntry[warningKey]}`);
							}
						});
					}
				}
			);
		}
	}

	if (test.expect && results.output !== test.expect) {
		errorsCount++
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
