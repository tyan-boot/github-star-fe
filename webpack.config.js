const path = require("path");
const webpack = require("webpack");
const devMode = process.env.NODE_ENV !== "production";
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: "development",
  entry: {
    app: "./src/index.js"
  },
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist"),
    publicPath: "/"
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ["style-loader","css-loader"]
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "babel-loader"
      },
      {
        test: /\.less$/,
        use: [
          "style-loader",
          "css-loader",
          "less-loader"
        ]
      }
    ]
  },
  devServer: {
    contentBase: "./dist",
    historyApiFallback: true,
    proxy: {
      "/api": "http://localhost:8080/"
    },
    port: 3000,
    hot: true
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: "Your Star",
      inject: false,
      template: require("html-webpack-template"),
      mobile: true,
      lang: "zh-CN"
    }),
    new webpack.HotModuleReplacementPlugin(),
  ],
  optimization: {
    splitChunks: {
      chunks: "all"
    }
  }
};
