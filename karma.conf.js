const isTravis = !!process.env.TRAVIS_BUILD_NUMBER;

const browsers = {
  slSafari10: {
    base: 'SauceLabs',
    browserName: 'safari',
    platform: 'OS X 10.12',
    version: '10.1'
  },
  slSafari11: {
    base: 'SauceLabs',
    browserName: 'safari',
    platform: 'OS X 10.13',
    version: '11'
  },
  // slIE11: {
  //   base: 'SauceLabs',
  //   browserName: 'internet explorer',
  //   platform: 'Windows 7',
  //   version: '11'
  // },
  // slEdge13: {
  //   base: 'SauceLabs',
  //   browserName: 'MicrosoftEdge',
  //   version: '13',
  //   platform: 'Windows 10'
  // },
  // slEdge14: {
  //   base: 'SauceLabs',
  //   browserName: 'MicrosoftEdge',
  //   version: '14',
  //   platform: 'Windows 10'
  // },
  // slEdge15: {
  //   base: 'SauceLabs',
  //   browserName: 'MicrosoftEdge',
  //   version: '15',
  //   platform: 'Windows 10'
  // },
  // slEdge: {
  //   base: 'SauceLabs',
  //   browserName: 'MicrosoftEdge',
  //   platform: 'Windows 10'
  // },
  slChrome: {
    base: 'SauceLabs',
    browserName: 'chrome'
  },
  slFirefox: {
    base: 'SauceLabs',
    browserName: 'firefox'
  }
};

module.exports = function(config) {
  config.set({
    basePath: '',
    frameworks: ['mocha', 'chai'],
    files: [
      'dist/tests/browser.js',
    ],
    reporters: ['saucelabs'],
    port: 9876,
    colors: true,
    singleRun: true,
    sauceLabs: {
      build: 'TRAVIS #' + process.env.TRAVIS_BUILD_NUMBER + ' (' + process.env.TRAVIS_BUILD_ID + ')',
      tunnelIdentifier: process.env.TRAVIS_JOB_NUMBER,
      testName: `tastatur`,
      startConnect: false,
      public: 'public'
    },
    browsers: Object.keys(browsers),
    customLaunchers: browsers,
    captureTimeout: 300000,
    browserNoActivityTimeout: 300000,
    browserDisconnectTolerance: 2,
    concurrency: 5,
  });
}
