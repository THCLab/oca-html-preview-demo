const CopyWebpackPlugin = require('copy-webpack-plugin');
const path = require('path');

module.exports = {
  mode: "development",
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "index.js",
    library: {
      type: "commonjs"
    }
  },
  resolve: {
    extensions: [ ".js" ],
    alias: {
      "@": path.resolve(__dirname, "src")
    }
  },
  module: {},
  plugins: [
    new CopyWebpackPlugin({
      patterns: [
        { from: "src/index.html" }
      ]
    })
  ]
};
