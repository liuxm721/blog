const commonCfg = require("./webpack.common.js")
const path = require("path")
const { default: merge } = require("webpack-merge")

let devCfg = {
    mode: "development",
    devtool: "source-map",
    devServer: {
        contentBase: path.resolve(__dirname, "..", "dist"),
        host: "0.0.0.0",
        port: 80
    }
}
module.exports = merge(devCfg, commonCfg)