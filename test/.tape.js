module.exports = {
	'test/plugin': [
		// test warnings
		{
			source: ':root { color: blue }',
			warnings: 1
		},
		// test autofixing
		{
			source: ':root { color: blue }',
			expect: 'html { color: blue }'
		}
	]
};
