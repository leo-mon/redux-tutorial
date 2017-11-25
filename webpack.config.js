module.exports={
  entry: {
    app: "./src/app.js",
    multicounters: "./src/multicounters.js",
    todo: "./src/todo.js"
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
  devServer: {
    contentBase: "./dist",
    port: 3000,
  }
}
