import path from 'path';
import stylelintTape from './index';
import cliOptions from '../lib/get-cli-options';
import requireOrThrow from '../lib/require-or-throw';

const tests = requireOrThrow(path.resolve(cliOptions.cwd, cliOptions.tape));

stylelintTape(cliOptions, tests).then(
	process.exit.bind(process, 0),
	error => console.error(`${error.message}`) || process.exit(1)
);
