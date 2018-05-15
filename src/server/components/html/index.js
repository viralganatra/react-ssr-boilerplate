import React from 'react';
import { renderToString } from 'react-dom/server';
import { Helmet } from 'react-helmet';
import { Capture } from 'react-loadable';
import { getBundles } from 'react-loadable/webpack';
import faviconUrl from 'server/components/html/images/favicon.ico';

const Html = ({ children, clientStats, reactLoadableStats }) => {
  try {
    const modules = [];

    renderToString(
      <Capture report={(moduleName) => modules.push(moduleName)}>{children}</Capture>,
    );

    const helmet = Helmet.renderStatic();

    const meta = helmet.meta.toComponent();
    const title = helmet.title.toComponent();

    const { runtime, vendor, main } = clientStats.assetsByChunkName;

    const runtimeFile = Array.isArray(runtime) ? runtime[0] : runtime;
    const vendorFile = Array.isArray(vendor) ? vendor[0] : vendor;
    const mainFile = Array.isArray(main) ? main[0] : main;

    const bundles = getBundles(reactLoadableStats, modules);

    const scripts = bundles.filter((bundle) => bundle.file.endsWith('.js'));

    return (
      <html lang="en">
        <head>
          <meta charSet="utf-8" />
          {meta}
          {title}
          <link rel="shortcut icon" href={faviconUrl} />
        </head>
        <body>
          <div id={process.env.REACT_CONTAINER_ID}>{children}</div>
          <script src={`/dist/${runtimeFile}`} />
          <script src={`/dist/${vendorFile}`} />
          {scripts.map(({ file }) => <script key={file} src={`/dist/${file}`} />)}
          <script src={`/dist/${mainFile}`} />
        </body>
      </html>
    );
  } catch (error) {
    return null;
  }
};

export default Html;
