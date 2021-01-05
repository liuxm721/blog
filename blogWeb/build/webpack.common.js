const HtmlWebpackPlugin = require("html-webpack-plugin")
const path = require("path")
const { VueLoaderPlugin } = require("vue-loader")

module.exports = {
    entry: {
        login: path.resolve(__dirname, "..", "src/pages/login/main.js"),
        user: path.resolve(__dirname, "..", "src/pages/user/main.js"),
        admin: path.resolve(__dirname, "..", "src/pages/admin/main.js"),
    },
    output: {
        path: path.resolve(__dirname, "..", "dist")
    },
    module: {
        rules: [
            {
                test: /\.vue$/,
                loader: "vue-loader"
            },
            {
                test: /\.(css|scss)$/,
                use: [
                    "style-loader",
                    {
                        loader: "css-loader",
                        options: {
                            importLoaders: 2
                        }
                    },
                    "postcss-loader",
                    "sass-loader"
                ]
            },
            {
                test: /\.(ttf|woff|svg|woff2|eot)$/,
                use: {
                    loader: "file-loader",
                    options: {
                        outputPath: "fonts",
                        name: "[name].[ext]"
                    }
                }
            },
            {
                test: /\.(jpg|jped|png)/,
                loader: "url-loader",
                options: {
                    outputPath: "img",
                    name: "[name][hash].[ext]",
                    limit: 2000
                }
            },
            {
                test: /\.js$/,
                loader: "babel-loader"
            },
            {
                test: /\.ico$/,
                loader: "file-loader",
                options: {
                    name: "[name].[ext]"
                }
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, "..", "src/pages/user/index.html"),
            title: "首页",
            filename: "index.html",
            chunks: ["user"]
        }),
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, "..", "src/pages/login/index.html"),
            title: "登录/注册",
            filename: "login.html",
            chunks: ["login"]
        }),
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, "..", "src/pages/admin/index.html"),
            title: "管理",
            filename: "admin.html",
            chunks: ["admin"]
        }),
        new VueLoaderPlugin()
    ],
    resolve: {
        extensions: [".js", ".vue", ".json"],
        alias: {
            "@": path.resolve(__dirname, "../src")
        }
    },
    optimization: {
        splitChunks: {
            cacheGroups: {
                default: {
                    name: true,
                    chunks: "all",
                    minChunks: 2,
                    priority: -2,
                    reuseExistingChunk: true
                },
                vendors: {
                    test: /[\\/]node_modules[\\/]/,
                    minChunks: 1,
                    chunks: "all",
                    priority: -10
                }
            }
        }
    },

}