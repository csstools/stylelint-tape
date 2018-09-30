const stylelintTape = require('..');
const tests = require('./.tape');

stylelintTape('test/index.js', tests).then(
	() => process.exit(0),
	() => process.exit(1)
);
