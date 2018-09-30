import path from 'path';
import stylelintTape from './index';
import binOptions from '../lib/get-bin-options';
import requireOrThrow from '../lib/require-or-throw';

const tests = requireOrThrow(path.resolve(binOptions.cwd, binOptions.tape));

stylelintTape(binOptions, tests).then(
	process.exit.bind(process, 0),
	error => console.error(`${error.message}`) || process.exit(1)
);
