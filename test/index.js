import stylelint from 'stylelint';

const ruleName = 'test/plugin';

const ruleFunction = (action) => {
	return (root, result) => {
		if (is(action, [ 'always', true ])) {
			root.walkRules(':root', rule => {
				const message = messages.unexpectedRoot(rule, 'html');
				const node = rule;

				stylelint.utils.report({
					ruleName,
					message,
					node,
					result,
					fix: {
						node: rule,
						apply: () => {
							rule.selector = 'html';
						}
					}
				});
			});
		}
	};
};

const messages = stylelint.utils.ruleMessages(ruleName, {
	unexpectedRoot(rule, fix) {
		return `Unexpected "${rule.selector}" rule. Use "${fix}".`;
	}
});

const is = (value, ...keys) => {
	const length = keys.length;
	const matches = keys.pop();
	const subvalue = keys.reduce((result, key) => Object(result)[key], value);

	return length
		? [].concat(matches).some(
			match => match instanceof RegExp
				? match.test(subvalue)
			: match === subvalue
		)
	: Boolean(value);
};

const meta = {
	fixable: true,
};

ruleFunction.meta = meta;

const plugin = stylelint.createPlugin(ruleName, ruleFunction);

export default plugin;
