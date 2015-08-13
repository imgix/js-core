module.exports = {
    context: __dirname + "/src",
    entry: "./imgix-core-js.js",
    module: {
      loaders: [
        {
          test: /\.js$/,
          exclude: /(node_modules|bower_components)/,
          loader: 'babel'
        }
      ]
    },
    devtool: "cheap-module-source-map",
    target: "web",
    output: {
        path: __dirname + "/dist",
        filename: "imgix-core-js.umd.js",
        sourceMapFilename: "imgix-core-js.umd.js.map",
        library: "Imgix",
        libraryTarget: "umd"
    }
};