/* eslint-env node */

const path = require('path');
const webpack = require('webpack');
const WebpackBar = require('webpackbar');

console.log('$webpack node_module path', path.join(__dirname, 'node_modules'));

module.exports = (env) => {
  // use this instead of process.env.NODE_ENV
  console.log('$webpack env', env);
  return {
    entry: {
    // Each entry in here would declare a file that needs to be transpiled
    // and included in the extension source.
    // For example, you could add a background script like:
      background: 'background.js',
      popup: 'popup/popup.js',
      content: 'content.js',
      hook: 'Hooks/index.js',
      omnibox: 'omnibox/index.js',
    },
    output: {
    // This copies each source entry into the extension dist folder named
    // after its entry config key.
      path: path.join(__dirname, 'extension', 'dist', 'js'),
      filename: '[name].js',
    },
    module: {
      rules: [{
        exclude: [path.join(__dirname, 'node_modules')],
        test: /\.js$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              ['@babel/preset-env', { targets: 'defaults' }],
            ],
          },
        },
      },
      {
        exclude: [path.join(__dirname, 'node_modules')],
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      }],
    },
    resolve: {
    // This allows you to import modules just like you would in a NodeJS app.
      extensions: ['.js', '.jsx'],
      modules: [
        path.join(__dirname, 'src'),
        'node_modules',
      ],
    },
    plugins: [
    // Since some NodeJS modules expect to be running in Node, it is helpful
    // to set this environment var to avoid reference errors.
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(env.mode),
      }),
      new WebpackBar(),
    ],
  // This will expose source map files so that errors will point to your
  // original source files instead of the transpiled files.
  };
};
