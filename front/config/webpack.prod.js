const path = require("path");
const { merge } = require("webpack-merge");
const common = require("./webpack.config.js");

module.exports = merge(common, {
    mode: "production",
    output: {
        path: path.join(__dirname, "../../electron/front-build"),
        filename: "[name].[contenthash].js",
    },
});
