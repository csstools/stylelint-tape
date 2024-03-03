import path from 'path';
import stylelintTape from './index.mjs';
import cliOptions from '../lib/get-cli-options.mjs';

const tests = await import(path.resolve(cliOptions.cwd, cliOptions.tape));

stylelintTape(cliOptions, 'default' in tests ? tests.default : tests).then(
	process.exit.bind(process, 0),
	error => console.error(`${error.message}`) || process.exit(1)
);
