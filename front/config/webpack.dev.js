const path = require("path");
const { merge } = require("webpack-merge");
const common = require("./webpack.config.js");
const ESLintPlugin = require("eslint-webpack-plugin");
module.exports = merge(common, {
    mode: "development",
    devServer: {
        static: {
            directory: path.join(__dirname, "public"),
        },
        compress: true,
        port: 3000,
    },
    plugins: [
        new ESLintPlugin({
            extensions: ["jx", "jsx", "ts", "tsx"],
        }),
    ],
    devtool: "eval-cheap-module-source-map",
});
