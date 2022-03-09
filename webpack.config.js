const CopyWebpackPlugin = require('copy-webpack-plugin');
const path = require('path');

module.exports = {
  mode: "development",
  entry: {
   "acdc": "./src/acdc.js",
   "credential": "./src/credential.js",
   "form": "./src/form.js"
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].js",
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
        { from: "src/index.html" },
        { from: "src/views/acdc.html" },
        { from: "src/views/credential.html" },
        { from: "src/views/form.html" },
        { from: "public/*" }
      ]
    })
  ]
};
