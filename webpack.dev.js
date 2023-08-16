/* eslint-disable no-param-reassign */
/* eslint-disable import/extensions */
/* eslint-disable import/no-extraneous-dependencies */

const { merge } = require('webpack-merge');
const common = require('./webpack.config.js');

module.exports = (env) => {
  const mode = 'development';
  env.mode = mode;
  return merge(common(env), {
    devtool: 'inline-source-map',
    mode,
  });
};
