import stylelintTape from '../index.mjs';
import tests from './.tape.cjs';

stylelintTape('test/index.js', tests).then(
	() => process.exit(0),
	() => process.exit(1)
);
