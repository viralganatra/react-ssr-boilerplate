const webpack = require('webpack');
const path = require('path');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const { ReactLoadablePlugin } = require('react-loadable/webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const resolvePath = (pathname) => path.resolve(__dirname, pathname);

module.exports = (env) => {
  const ifDev = (...args) => (env.dev ? args : []);

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
              plugins: [
                'react-loadable/babel',
                ...ifDev('react-hot-loader/babel'),
                [
                  'react-css-modules',
                  {
                    generateScopedName: '[path]-[name]-[local]-[hash:base64:5]',
                    webpackHotModuleReloading: env.dev,
                    filetypes: {
                      '.scss': {
                        syntax: 'postcss-scss',
                      },
                    },
                  },
                ],
              ],
            },
          },
        },
        {
          test: /\.s?css$/,
          exclude: /node_modules/,
          use: [
            env.dev ? 'style-loader' : MiniCssExtractPlugin.loader,
            {
              loader: 'css-loader',
              options: {
                importLoader: 1,
                localIdentName: '[path]-[name]-[local]-[hash:base64:5]',
                modules: true,
                sourceMap: true,
              },
            },
            {
              loader: 'sass-loader',
              options: {
                sourceMap: true,
              },
            },
          ],
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
      ...ifDev(new webpack.HotModuleReplacementPlugin()),
      new webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: JSON.stringify(NODE_ENV),
          REACT_CONTAINER_ID: JSON.stringify('react-container'),
        },
      }),
      new ReactLoadablePlugin({
        filename: `./client/${NODE_ENV}/react.loadable.${NODE_ENV}.stats.webpack.json`,
      }),
      new MiniCssExtractPlugin({
        filename: env.dev ? '[name].css' : '[name].[hash].css',
        chunkFilename: env.dev ? '[id].css' : '[id].[hash].css',
      }),
    ],
    optimization: {
      minimizer: [
        new UglifyJsPlugin({
          cache: true,
          sourceMap: true,
          parallel: 4,
        }),
      ],
      runtimeChunk: 'single',
      splitChunks: {
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendor',
            chunks: 'all',
          },
        },
      },
    },
    resolve: {
      modules: [resolvePath('../../src'), 'node_modules'],
    },
    mode: NODE_ENV,
    target: 'web',
  };
};
