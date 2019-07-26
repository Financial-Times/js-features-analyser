# JavaScript Feature Analyser

A Node.js command-line application for figuring out what standard-library features are being used within a JavaScript file.

[![NPM version](https://img.shields.io/npm/v/@financial-times/js-features-analyser.svg)](https://www.npmjs.com/package/@financial-times/js-features-analyser)
[![Build status](https://img.shields.io/circleci/build/gh/JakeChampion/js-features-analyser.svg)](https://circleci.com/gh/JakeChampion/js-features-analyser)
[![MIT licensed](https://img.shields.io/badge/license-MIT-blue.svg)][license]

```bash
> npx @financial-times/js-features-analyser analyse --file bundle.js
```


## Table Of Contents

  - [Usage](#usage)
  - [Limitations](#limitations)
  - [Contributing](#contributing)
  - [Publishing](#publishing)
  - [Contact](#contact)
  - [Licence](#licence)


## Usage

This project requires [Node.js] 10.x and [npm]. You can install with:

```sh
npm install @financial-times/js-features-analyser
```

## Limitations

This project does not compile syntax at all.

Create a bundle which targets the syntax level you support (ES3/5/2017/2019) and then pass that bundle through this tool.

The reason to create the bundle first is because if you are compiling your code down to another syntax level, the compiled code will contain different built-ins than the uncompiled version. E.G. Compiling `async function() { await 7;}` to ES5 will make the compiled output have `Promise` in it, which this tool will then detect.

This project does not know the types that are within the code being analysed, which means that when it sees a name of a builtin being used, it will add all the builtins which match that name to it's output. E.G. Analysing `[1].reduce(function(){})` will not only detect that `Array.prototype.reduce` was used, it would also incorrectly detect that `Int8Array.prototype.reduce`, `Uint8Array.prototype.reduce`, `Uint8ClampedArray.prototype.reduce`, `Int16Array.prototype.reduce`, `Uint16Array.prototype.reduce`, `Int32Array.prototype.reduce`, `Uint32Array.prototype.reduce`, `Float32Array.prototype.reduce`, and `Float64Array.prototype.reduce` were also used.


## Contributing

This module has a full suite of unit tests, and is verified with ESLint. You can use the following commands to check your code before opening a pull request:

```sh
npm test    # verify JavaScript code with ESLint and run the tests
```


## Publishing

New versions of the module are published automatically by CI for every commit which lands on the `master` branch.


## Contact

If you have any questions or comments about this module, or need help using it, please [raise an issue][issues].


## Licence

This software is under the [MIT licence][license].



[issues]: https://github.com/Financial-Times/origami-repo-data-client-node/issues
[license]: http://opensource.org/licenses/MIT
[node.js]: https://nodejs.org/
[npm]: https://www.npmjs.com/
