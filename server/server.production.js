if (!process.env.NODE_ENV) process.env.NODE_ENV = 'production';
if (!process.env.SERVER_HOST) process.env.SERVER_HOST = 'localhost';
if (!process.env.SERVER_PORT) process.env.SERVER_PORT = 3000;

const express = require('express');

const reactLoadableStats = require('../client/production/react.loadable.production.stats.webpack.json');
const webpackClientConfig = require('../config/webpack/client.config')({
  prod: true,
});
const webpackServerConfig = require('../config/webpack/server.config')({
  prod: true,
});

const clientOutputPath = webpackClientConfig.output.path;
const serverOutputPath = webpackServerConfig.output.path;

const clientStats = require(`${clientOutputPath}/client.production.stats.webpack.json`);
const serverStats = require(`${serverOutputPath}/server.production.stats.webpack.json`);
const serverSideRender = require(`${serverOutputPath}/serverSideRender`)
  .default;

const server = express();

server.disable('x-powered-by');

server.use('/dist', express.static(clientOutputPath));

server.use(serverSideRender({ clientStats, serverStats, reactLoadableStats }));

server.listen(process.env.SERVER_PORT, (error) => {
  if (error) {
    console.error(error);
  } else {
    console.log(
      `Server listening at http://${process.env.SERVER_HOST}:${
        process.env.SERVER_PORT
      }`,
    );
  }
});
