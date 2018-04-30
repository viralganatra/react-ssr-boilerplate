import React from 'react';
import { hydrate } from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { preloadReady } from 'react-loadable';
import AppContainer from 'react-hot-loader/lib/AppContainer';
import ClientApp from 'universal/app';

export const clientSideRender = async (
  Component = ClientApp,
  container = document.getElementById(process.env.REACT_CONTAINER_ID),
  callback = () => console.log('clientSideRender'),
) => {
  await preloadReady();

  hydrate(
    <AppContainer>
      <BrowserRouter>
        <Component />
      </BrowserRouter>
    </AppContainer>,
    container,
    callback,
  );
};

if (module.hot) {
  module.hot.accept('universal/app', () => clientSideRender(ClientApp));
}

clientSideRender();
