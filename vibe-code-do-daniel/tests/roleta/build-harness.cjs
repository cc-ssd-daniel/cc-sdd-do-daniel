// Reuse the existing CRA compiler with a separate entry, without editing App or its registry.
process.env.NODE_ENV = 'production';
process.env.BABEL_ENV = 'production';
const path = require('path');
const webpack = require('webpack');
const makeConfig = require('react-scripts/config/webpack.config');
const config = makeConfig('production');
config.entry = path.resolve(__dirname, '../../src/minigames/roleta/harnessEntry.js');
config.output.path = path.resolve(__dirname, '../../build/roleta');
config.output.publicPath = './';
webpack(config, (error, stats) => {
  if (error) { console.error(error); process.exitCode = 1; return; }
  console.log(stats.toString({ all: false, errors: true, warnings: true, timings: true, assets: true }));
  if (stats.hasErrors()) process.exitCode = 1;
});
