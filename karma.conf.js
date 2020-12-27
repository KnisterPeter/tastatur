const browsers = {
  slSafari11: {
    base: "SauceLabs",
    browserName: "safari",
  },
  slChrome: {
    base: "SauceLabs",
    browserName: "chrome",
  },
  slFirefox: {
    base: "SauceLabs",
    browserName: "firefox",
  },
};

module.exports = function (config) {
  config.set({
    basePath: "",
    frameworks: ["mocha", "chai"],
    files: ["dist/tests/browser.js"],
    reporters: ["saucelabs"],
    port: 9876,
    colors: true,
    singleRun: true,
    sauceLabs: {
      build:
        "GH #" +
        process.env.GITHUB_RUN_NUMBER +
        " (" +
        process.env.GITHUB_RUN_ID +
        ")",
      tunnelIdentifier: "github-action-tunnel",
      testName: `tastatur`,
      startConnect: false,
      public: "public",
    },
    browsers: Object.keys(browsers),
    customLaunchers: browsers,
    captureTimeout: 300000,
    browserNoActivityTimeout: 300000,
    browserDisconnectTolerance: 2,
    concurrency: 5,
  });
};
