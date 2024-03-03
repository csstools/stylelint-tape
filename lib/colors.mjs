const colors = {
	reset: '\x1b[0m',
	bold: '\x1b[1m',
	dim: '\x1b[2m',
	underline: '\x1b[4m',
	blink: '\x1b[5m',
	reverse: '\x1b[7m',
	hidden: '\x1b[8m',
	black: '\x1b[30m',
	red: '\x1b[31m',
	green: '\x1b[32m',
	yellow: '\x1b[33m',
	blue: '\x1b[34m',
	magenta: '\x1b[35m',
	cyan: '\x1b[36m',
	white: '\x1b[37m',
	bgBlack: '\x1b[40m',
	bgRed: '\x1b[41m',
	bgGreen: '\x1b[42m',
	bgYellow: '\x1b[43m',
	bgBlue: '\x1b[44m',
	bgMagenta: '\x1b[45m',
	bgCyan: '\x1b[46m',
	bgWhite: '\x1b[47m'
};

const getColorFn = key => string => `${colors[key]}${String(string).replace(colors.reset, `${colors.reset}${colors[key]}`)}${colors.reset}`;

export const reset = getColorFn('reset');

export const bold = getColorFn('bold');
export const dim = getColorFn('dim');
export const underline = getColorFn('underline');
export const blink = getColorFn('blink');
export const reverse = getColorFn('reverse');
export const hidden = getColorFn('hidden');

export const black = getColorFn('black');
export const red = getColorFn('red');
export const green = getColorFn('green');
export const yellow = getColorFn('yellow');
export const blue = getColorFn('blue');
export const magenta = getColorFn('magenta');
export const cyan = getColorFn('cyan');
export const white = getColorFn('white');

export const bgBlack = getColorFn('bgBlack');
export const bgRed = getColorFn('bgRed');
export const bgGreen = getColorFn('bgGreen');
export const bgYellow = getColorFn('bgYellow');
export const bgBlue = getColorFn('bgBlue');
export const bgMagenta = getColorFn('bgMagenta');
export const bgCyan = getColorFn('bgCyan');
export const bgWhite = getColorFn('bgWhite');
