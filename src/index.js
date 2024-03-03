import logUpdate from 'log-update';
import path from 'path';
import stylelint from 'stylelint';
import { bold, cyan, dim, green, red, white, yellow } from '../lib/colors';
import { trim, json } from '../lib/utils';
import { done, fail, wait } from '../lib/symbols';
import nodeOptions from '../lib/get-node-options';

export default async function stylelintTape(options, testsByRuleName) {
	let errorsCount = 0

	const normalizedopts = Object.assign(
		{},
		nodeOptions,
		options === Object(options) ? options : { plugin: options }
	);

	normalizedopts.plugin = path.resolve(normalizedopts.cwd, normalizedopts.plugin || '');

	for (const ruleName in testsByRuleName) {
		const tests = testsByRuleName[ruleName];

		for (const test of tests) {
			const title = getTitleByTest(test);

			// update log for pending test
			logUpdate(`${dim(wait)} ${title}`);

			// run test and update log with results
			await runTest(ruleName, test, normalizedopts, errorsCount).then(() => {
				logUpdate(`${green(done)} ${white(title)}`)
			}, (error) => {
				// update error count in case there is errors
				errorsCount++
				logUpdate(`${red(fail)} ${bold(title)}\n ${yellow(trim(error.message))}`)
			}).then(() => {
				logUpdate.done()
			});
		}
	}

	if (errorsCount === 0) {
		return Promise.resolve()
	}

	return Promise.reject(Error('Tests failed.'))
};

function runTest(ruleName, test, opts) {
	return stylelint.lint({
		code: test.source,
		config: {
			plugins: [ path.resolve(opts.cwd, opts.plugin) ],
			rules: {
				[ruleName]: test.args || opts.defaultArgs
			}
		},
		fix: Boolean(test.expect)
	}).then(results => {
		const warnings = results.results.reduce((array, result) => {
			return array.concat(result.warnings)
		}, []);

		if (typeof test.warnings === 'number' && test.warnings !== warnings.length) {
			// throw when the warning length by number does not match
			throw new Error(`Expected ${test.warnings} warnings\nReceived ${warnings.length} warnings`);
		}

		if (Array.isArray(test.warnings)) {
			if (test.warnings.length !== warnings.length) {
				// throw when the warning length by array does not match
				throw new Error(`Expected ${test.warnings.length} warnings\nReceived ${warnings.length} warnings`);
			}

			test.warnings.forEach((warningEntry, warningIndex) => {
				if (typeof warningEntry === 'string' && warningEntry !== warnings[warningIndex].text) {
					// throw when the warning text does not match
					throw new Error(`Expected warning: "${warningEntry}"\nReceived warning: "${warnings[warningIndex].text}"`);
				}

				Object.keys(Object(warningEntry)).forEach(warningKey => {
					if (warnings[warningIndex][warningKey] === warningEntry[warningKey]) {
						// throw when the warning key-value pair does not match
						throw new Error(`Expected: "${warningKey}" as ${warnings[warningIndex][warningKey]}\nReceived: ${warningEntry[warningKey]}`);
					}
				});
			});
		}

		if (test.expect && results.output !== test.expect) {
			throw new Error(`Expected: ${test.expect}\nReceived: ${results.output}`);
		}
	});
}

function getWarningsByTest(test) {
	if (test.warnings instanceof Array) {
		return test.warnings.length
	}

	if (typeof test.warnings === 'number') {
		return test.warnings
	}

	return 0
}

function getargsByTest(test) {
	if (test.args) {
		return ` with ${green(json(test.args))}`
	}

	return ''
}

function getTitleByTest(test) {
	if ('title' in test) {
		return test.title
	}

	if ('expect' in test) {
		return `${cyan(test.source)}${getargsByTest(test)} becomes ${cyan(test.expect)}`
	}

	const numberOfWarnings = getWarningsByTest(test);
	const warnings = numberOfWarnings === 1 ? 'warning' : 'warnings';

	return `${cyan(test.source)}${getargsByTest(test)} reports ${yellow(String(numberOfWarnings))} ${warnings}`;
}
