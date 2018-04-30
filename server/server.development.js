if (!process.env.NODE_ENV) process.env.NODE_ENV = 'development';
if (!process.env.SERVER_HOST) process.env.SERVER_HOST = 'localhost';
if (!process.env.SERVER_PORT) process.env.SERVER_PORT = 8080;

const express = require('express');
const { preloadAll } = require('react-loadable');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const webpackHotServerMiddleware = require('webpack-hot-server-middleware');

const reactLoadableStats = require('../client/development/react.loadable.development.stats.webpack.json');
const webpackClientConfig = require('../config/webpack/client.config')({
  dev: true,
});
const webpackServerConfig = require('../config/webpack/server.config')({
  dev: true,
});

const webpackCompiler = webpack([webpackClientConfig, webpackServerConfig]);
const [
  webpackClientCompiler,
  webpackServerCompiler,
] = webpackCompiler.compilers;

const server = express();

server.disable('x-powered-by');

server.use(webpackDevMiddleware(webpackCompiler));
server.use(webpackHotMiddleware(webpackClientCompiler));
server.use(
  webpackHotServerMiddleware(webpackCompiler, {
    serverRendererOptions: { reactLoadableStats },
  }),
);

let BUILD_COMPLETE = false;

webpackCompiler.plugin(
  'done',
  () =>
    !BUILD_COMPLETE &&
    server.listen(process.env.SERVER_PORT, (error) => {
      if (error) {
        console.error(error);
      } else {
        BUILD_COMPLETE = true;

        console.log(
          `Server listening at http://${process.env.SERVER_HOST}:${
            process.env.SERVER_PORT
          }`,
        );
      }
    }),
);
