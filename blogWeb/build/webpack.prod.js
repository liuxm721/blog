const { CleanWebpackPlugin } = require("clean-webpack-plugin")
const { default: merge } = require("webpack-merge")
const commonCfg = require("./webpack.common.js")

let prodCfg = {
    mode: "production",
    plugins: [
        new CleanWebpackPlugin()
    ]
}

module.exports = merge(prodCfg, commonCfg)