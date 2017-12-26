module.exports={
  entry: {
    index: "./src/index.js",
  },
  output: {
    path: __dirname+"/dist",
    filename: "[name].js"
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      }
    ]
  },
  devtool: 'inline-source-map',  // ソースマップ追加
  devServer: {  // webpack-dev-serverの設定
    contentBase: "./dist",
    port: 3000,
  }
}
