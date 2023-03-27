const common = require("./webpack.common");
const { merge } = require('webpack-merge');
const packageJson = require("./package.json");
const path = require("path");
const TerserPlugin = require("terser-webpack-plugin");
const webpack = require("webpack");

const downloadUrl = "https://raw.githubusercontent.com/p-toy-factory/fuego-hud/main/dist/index.user.js";
const updateUrl = downloadUrl

const banner = [
  "// ==UserScript==",
  "// @name         FuegoHud",
  `// @author       ${packageJson.author}`,
  `// @description  ${packageJson.description}`,
  `// @downloadURL  ${downloadUrl}`,
  `// @updateURL    ${updateUrl}`,
  "// @grant        none",
  `// @homepage     ${packageJson.homepage}`,
  `// @license      ${packageJson.license}`,
  "// @match        *://*/*",
  `// @supportURL   ${packageJson.bugs.url}`,
  "// @require      https://cdn.jsdelivr.net/npm/rxjs@7.8.0/dist/bundles/rxjs.umd.min.js",
  "// @run-at       document-body",
  `// @version      ${packageJson.version}`,
  "// ==/UserScript==",
].join("\n");

module.exports = merge(common, {
  mode: "production",
  entry: "./src/index.ts",
  externals: {
    rxjs: "rxjs",
  },
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          format: {
            beautify: true,
            comments: /==\/?UserScript==|^[ ]?@/,
            indent_level: 2,
          },
        },
      }),
    ],
  },
  output: {
    filename: "index.user.js",
    path: path.resolve(__dirname, "dist"),
  },
  plugins: [
    new webpack.BannerPlugin({
      raw: true,
      banner,
    })
  ],
});
