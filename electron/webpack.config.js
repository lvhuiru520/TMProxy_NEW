const path = require("path");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
module.exports = {
    entry: path.join(__dirname, "./src/main.ts"),
    output: {
        path: path.join(__dirname, "./dist/"),
        filename: "main.js",
    },
    resolve: {
        extensions: [".js", ".jsx", ".tsx", ".ts"],
    },
    performance: {
        hints: false,
    },
    mode: "development",
    module: {
        rules: [
            {
                test: /\.(js|jsx|ts|tsx)$/,
                exclude: /(node_modules|bower_components)/,
                use: [
                    {
                        loader: "babel-loader",
                    },
                ],
            },
            {
                test: /\.(png|jpe?g|gif)$/i,
                use: ["file-loader"],
            },
        ],
    },
    plugins: [
        new CleanWebpackPlugin(),
        new CopyPlugin({
            patterns: [
                {
                    from: path.resolve(__dirname, "./src/assets/"),
                    to: "assets",
                },
            ],
        }),
    ],
    target: "electron-main",
};
