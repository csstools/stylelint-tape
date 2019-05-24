const stylelint = require('stylelint');

const ruleName = 'test/plugin';

const ruleFunction = (action, opts, context) => {
	const shouldFix = is(context, 'fix', true);

	return (root, result) => {
		if (is(action, ['always', true])) {
			root.walkRules(':root', rule => {
				if (shouldFix) {
					rule.selector = 'html';
				} else {
					const message = messages.unexpectedRoot(rule, 'html');
					const node = rule;

					stylelint.utils.report({ ruleName, message, node, result });
				}
			});
		}
	};
};

const messages = stylelint.utils.ruleMessages(ruleName, {
	unexpectedRoot (rule, fix) {
		return `Unexpected "${rule.selector}" rule. Use "${fix}".`;
	}
});

const is = (value, ...keys) => {
	const length = keys.length;
	const matches = keys.pop();
	const subvalue = keys.reduce((result, key) => Object(result)[key], value);

	return length ?
		[].concat(matches).some(
			match => match instanceof RegExp
				? match.test(subvalue)
			: match === subvalue
		)
	: Boolean(value);
};

module.exports = stylelint.createPlugin(ruleName, ruleFunction);
