import React from 'react';
import { renderToNodeStream } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';
import { preloadAll } from 'react-loadable';
import ServerApp from 'universal/app';
import Html from 'server/components/html';

const serverSideRender = (stats) => async (req, res) => {
  await preloadAll();

  const { clientStats, reactLoadableStats } = stats;
  const context = {};

  const stream = renderToNodeStream(
    <Html clientStats={clientStats} reactLoadableStats={reactLoadableStats}>
      <StaticRouter context={context} location={req.url}>
        <ServerApp />
      </StaticRouter>
    </Html>,
  );

  res.type('html');

  res.write('<!doctype html>');

  stream.pipe(res);
};

export default serverSideRender;
