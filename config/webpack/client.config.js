const webpack = require('webpack');
const path = require('path');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const { ReactLoadablePlugin } = require('react-loadable/webpack');

const resolvePath = (pathname) => path.resolve(__dirname, pathname);

module.exports = (env) => {
  const ifDev = (...args) => (env.dev ? args : []);
  const ifProd = (...args) => (env.prod ? args : []);

  const NODE_ENV = env.dev ? 'development' : 'production';

  return {
    devtool: env.dev ? 'eval' : 'source-map',
    entry: {
      main: [
        ...ifDev(
          'webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000&reload=false&quiet=false&noInfo=false',
        ),
        resolvePath('../../src/client/entry/index.js'),
      ],
      vendor: [
        'react',
        'react-dom',
        'react-helmet',
        'react-loadable',
        'react-router-dom',
      ],
    },
    module: {
      rules: [
        {
          test: /\.jsx?$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              cacheDirectory: true,
              presets: [
                [
                  'env',
                  {
                    modules: false,
                    targets: {
                      browsers: ['last 2 Chrome versions'],
                    },
                    debug: env.dev,
                  },
                ],
                'react',
                'stage-0',
              ],
              plugins: ['react-loadable/babel', ...ifDev('react-hot-loader/babel')],
            },
          },
        },
      ],
    },
    name: 'client',
    output: {
      filename: env.dev ? '[name].js' : '[name].[chunkhash].js',
      chunkFilename: env.dev ? '[name].js' : '[name].[chunkhash].js',
      path: resolvePath(`../../client/${NODE_ENV}`),
      publicPath: '/dist/',
    },
    plugins: [
      new webpack.optimize.CommonsChunkPlugin({
        names: ['bootstrap'],
        filename: env.dev ? '[name].js' : '[name].[chunkhash].js',
        chunkFilename: env.dev ? '[name].js' : '[name].[chunkhash].js',
        minChunks: Infinity,
      }),
      ...ifDev(new webpack.HotModuleReplacementPlugin()),
      new webpack.NoEmitOnErrorsPlugin(),
      new webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: JSON.stringify(NODE_ENV),
          REACT_CONTAINER_ID: JSON.stringify('react-container'),
        },
      }),
      ...ifProd(
        new UglifyJsPlugin({
          cache: true,
          sourceMap: true,
          parallel: 4,
        }),
      ),
      new ReactLoadablePlugin({
        filename: `./client/${NODE_ENV}/react.loadable.${NODE_ENV}.stats.webpack.json`,
      }),
    ],
    resolve: {
      modules: [resolvePath('../../src'), 'node_modules'],
    },
    target: 'web',
  };
};
