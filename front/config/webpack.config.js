const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
module.exports = {
    entry: path.join(__dirname, "../src/index.tsx"),
    resolve: {
        extensions: [".js", ".jsx", ".tsx", ".ts"],
    },
    performance: {
        hints: false,
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx|ts|tsx)$/,
                exclude: /(node_modules|bower_components)/,
                use: [
                    {
                        loader: "babel-loader",
                        options: {
                            presets: ["@babel/preset-env"],
                        },
                    },
                ],
            },
            {
                test: /\.css$/,
                use: [
                    { loader: "style-loader" },
                    {
                        loader: "css-loader",
                    },
                ],
            },
            {
                test: /\.less$/,
                use: [
                    { loader: "style-loader" },
                    {
                        loader: "css-loader",
                        options: {
                            modules: true,
                        },
                    },
                    { loader: "less-loader" },
                ],
            },
            {
                test: /\.(png|jpg|gif)$/,
                use: ["file-loader"],
            },
            {
                test: /\.md$/,
                use: [
                    {
                        loader: "html-loader",
                    },
                    {
                        loader: "webpack-markdown-loader",
                        options: {
                            html: true,
                        },
                    },
                ],
            },
        ],
    },
    plugins: [
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            template: path.join(__dirname, "../public/index.html"),
            hash: true,
        }),
    ],
};
