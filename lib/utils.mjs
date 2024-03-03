export const trim = string => String(string).trim().replace(/\s+/g, ' ');

export const json = object => {
	try {
		// trimmed, stringified object with raw-formatted RegExp
		return trim(JSON.stringify(object, (key, value) => value instanceof RegExp
			? `__REGEX_START${value}__REGEX_END`
		: value, ' '))
			.replace(/"__REGEX_START([\W\w]+)__REGEX_END"/g, '$1')
			.replace(/^\[\s*([\W\w]*)\s*\]$/, '$1')
	} catch (error) {
		return '';
	}
};
