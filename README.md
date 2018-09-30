# stylelint-tape [<img src="https://jonathantneal.github.io/stylelint-logo.svg" alt="stylelint" width="90" height="90" align="right">][stylelint]

[![NPM Version][npm-img]][npm-url]
[![Build Status][cli-img]][cli-url]
[![Support Chat][git-img]][git-url]

[stylelint-tape] lets you test [stylelint] plugins.

## Usage

Add [stylelint-tape] to your project:

```bash
npm install stylelint-tape --save-dev
```

Add a `.tape.js` file with tests:

```js
module.exports = {
  'your/rule': [
    // test the # of warnings
    {
      source: 'body { top: 0 }',
      warnings: 1
    },
    // test for specific warnings
    {
      source: 'body { top: 0; left: 0 }',
      warnings: [
        'Unexpected "top" property.',
        'Unexpected "left" property.'
      ]
    },
    // test with arguments
    {
      source: 'body { top: 0 }',
      args: "always",
      warnings: 1
    },
    {
      source: 'body { top: 0 }',
      args: [ "always", { except: "top" } ]
    },
    // test autofixes
    {
      source: 'body { top: 0 }',
      expect: 'body { inset-block-start: 0 }'
    }
  ]
}
```

Use [stylelint-tape] in `package.json` to test your plugin:

```json
{
  "scripts": {
    "test:plugin": "stylelint-tape"
  }
}
```

```bash
npm run test:plugin
```

Or, use it within Node.

```js
const stylelintTape = require('stylelint-tape');
const plugin = require('path/to/plugin');

stylelintTape({ plugin: 'path/to/plugin.js' }, {
  'your/rule': [
    {
      source: 'body { top: 0 }',
      warnings: 1
    }
  ]
}).then(
  () => console.log('tests passed'),
  error => console.error('tests failed', error)
);
```

[cli-img]: https://img.shields.io/travis/csstools/stylelint-tape.svg
[cli-url]: https://travis-ci.org/csstools/stylelint-tape
[git-img]: https://img.shields.io/badge/support-chat-blue.svg
[git-url]: https://gitter.im/stylelint/stylelint
[npm-img]: https://img.shields.io/npm/v/stylelint-tape.svg
[npm-url]: https://www.npmjs.com/package/stylelint-tape

[stylelint]: https://github.com/stylelint/stylelint
[stylelint-tape]: https://github.com/csstools/stylelint-tape
