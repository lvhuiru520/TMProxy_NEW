const path = require("path");
const { merge } = require("webpack-merge");
const common = require("./webpack.config.js");
const CopyPlugin = require("copy-webpack-plugin");
module.exports = merge(common, {
    mode: "production",
    plugins: [
        new CopyPlugin({
            patterns: [
                {
                    from: path.resolve(__dirname, "./front-build"),
                    to: "front",
                },
            ],
        }),
    ],
});
