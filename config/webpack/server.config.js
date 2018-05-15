const webpack = require('webpack');
const path = require('path');

const resolvePath = (pathname) => path.resolve(__dirname, pathname);

module.exports = (env) => {
  const ifDev = (...args) => (env.dev ? args : []);

  const NODE_ENV = env.dev ? 'development' : 'production';

  return {
    devtool: env.dev ? 'eval' : 'source-map',
    entry: [resolvePath('../../src/server/entry/index.js')],
    module: {
      rules: [
        {
          test: /\.jsx?$/,
          exclude: /node_modules/,
          loader: 'babel-loader',
          options: {
            plugins: ['react-loadable/babel', ...ifDev('react-hot-loader/babel')],
            presets: [
              [
                'env',
                {
                  modules: false,
                  targets: {
                    node: '8.10',
                  },
                },
              ],
              'react',
              'stage-0',
            ],
          },
        },
        {
          test: /\.(gif|ico|jpg|png|svg)$/,
          loader: 'url-loader',
        },
      ],
    },
    name: 'server',
    output: {
      filename: 'serverSideRender.js',
      libraryTarget: 'commonjs2',
      path: resolvePath(`../../server/${NODE_ENV}`),
    },
    plugins: [
      new webpack.optimize.LimitChunkCountPlugin({
        maxChunks: 1,
      }),
      new webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: JSON.stringify(`${NODE_ENV}`),
          REACT_CONTAINER_ID: JSON.stringify('react-container'),
        },
      }),
    ],
    resolve: {
      modules: [resolvePath('../../src'), 'node_modules'],
    },
    mode: NODE_ENV,
    target: 'node',
  };
};
