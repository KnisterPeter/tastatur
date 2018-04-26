const path = require("path");
const nodeExternals = require('webpack-node-externals');

module.exports = {
  mode: 'development',
  entry: path.resolve(__dirname, "./index.test.ts"),
  output: {
    path: path.resolve(__dirname, "../dist/tests"),
    filename: "browser.js",
    library: "tastatur",
    libraryTarget: "umd"
  },
  externals: ['jsdom'],
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".json"]
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: "ts-loader",
            options: {
              compilerOptions: {
                declaration: false
              }
            }
          }
        ]
      }
    ]
  }
};
