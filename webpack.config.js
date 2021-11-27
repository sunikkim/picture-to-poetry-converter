const path = require("path");
const webpack = require("webpack");

module.exports = {
  entry: "./client/src/index.js",
  mode: "development",
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /(node_modules|bower_components)/,
        loader: "babel-loader",
        options: { presets: ["@babel/env"] }
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"]
      },
      {
        test: /\.(gif|png|jpe?g)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: 'client/photos/'
            }
          }
        ]
      },
    ]
  },
  resolve: { extensions: ["*", ".js", ".jsx"] },
  output: {
    path: path.resolve(__dirname, "client/build"),
    publicPath: path.resolve(__dirname, "client/build"),
    filename: "bundle.js"
  },
  devServer: {
    contentBase: path.join(__dirname, "client/build"),
    port: 3000,
    publicPath: "http://localhost:3000/client/",
    hot: true,
  },
  plugins: [new webpack.HotModuleReplacementPlugin()]
};