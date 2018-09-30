const cwd = process.cwd();
const optRegExp = /^--([\w-]+)$/;

// return default options with overrides from cli arguments
export default process.argv.reduce(
	(object, arg, index) => {
		const last = process.argv[index - 1];
		const key = optRegExp.test(last) && String(last).replace(optRegExp, '$1');

		return Object.assign(object, key ? { [key]: arg } : null);
	},
	{
		cwd,
		tape: '.tape.js'
	}
);
