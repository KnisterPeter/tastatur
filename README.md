> tastatur

[![npm](https://img.shields.io/npm/v/tastatur.svg)](https://www.npmjs.com/package/tastatur)
[![GitHub license](https://img.shields.io/github/license/KnisterPeter/tastatur.svg)]()
[![Travis](https://img.shields.io/travis/KnisterPeter/tastatur.svg)](https://travis-ci.org/KnisterPeter/tastatur)
[![codecov](https://codecov.io/gh/KnisterPeter/tastatur/branch/master/graph/badge.svg)](https://codecov.io/gh/KnisterPeter/tastatur)[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)
[![Standard Version](https://img.shields.io/badge/release-standard%20version-brightgreen.svg)](https://github.com/conventional-changelog/standard-version)
[![renovate badge](https://img.shields.io/badge/renovate-enabled-brightgreen.svg)](https://renovateapp.com/)

input and keyboard handling in javascript.

[![Build Status](https://saucelabs.com/browser-matrix/KnisterPeter.svg)](https://saucelabs.com/beta/builds/88c196f5bd4b4ed296c1419798d66af3)

# DEPRECATED

tastatur is not maintained any longer

# Usage

## Installation
Install as npm package:

```sh
npm install tastatur --save
```

## API

```js
const tastatur = new exports.Tastatur();
tastatur.install();
tastatur.bind('ctrl+s', e => {
  // do something on callback...
});
```

### Big Thanks

Development sponsored by [Magicline](http://www.magicline.com).

Cross-browser Testing Platform and Open Source :heart: Provided by [Sauce Labs](https://saucelabs.com)

---

 (C) 2018 Markus Wolf
