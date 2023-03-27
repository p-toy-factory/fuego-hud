const common = require("./webpack.common")
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { merge } = require('webpack-merge');
const path = require("path");

module.exports = merge(common, {
  mode: "development",
  devServer: {
    static: "./dist",
  },
  entry: "./src/index.ts",
  output: {
    filename: "index.js",
    path: path.resolve(__dirname, "dist"),
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./public/index.html",
    }),
  ],
});
