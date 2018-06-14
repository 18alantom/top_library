const HTMLWebpackPlugin = require('html-webpack-plugin');

const HTMLWebpackPluginConfig = new HTMLWebpackPlugin({
  template: `${__dirname}/src/index.html`,
  filename: 'index.html',
  inject: 'body',
});

module.exports = {
  mode: 'development',
  entry: `${__dirname}/src/script.jsx`,
  module: {
    rules: [{
      test: /\.jsx?$/,
      exclude: /node_modules/,
      loader: 'babel-loader',
    },

    // {
    //   test: /\.css$/,
    //   use: ['style-loader', 'css-loader'],
    // }, {
    //   test: /\.scss/,
    //   loaders: ['style', 'css', 'sass'],
    // }
    {
      test: /\.s?css$/,
      use: [
        'style-loader', // creates style nodes from JS strings
        'css-loader', // translates CSS into CommonJS
        'sass-loader', // compiles Sass to CSS
      ],
    },

    ],

  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  output: {
    filename: 'bundle.js',
    path: `${__dirname}/docs`,
  },
  plugins: [HTMLWebpackPluginConfig],
};
