import React from 'react';
import { hydrate } from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { preloadReady } from 'react-loadable';
import { hot } from 'react-hot-loader';
import ClientApp from 'universal/app';

export const clientSideRender = async (
  Component = hot(module)(ClientApp),
  container = document.getElementById(process.env.REACT_CONTAINER_ID),
  callback = () => {},
) => {
  await preloadReady();

  hydrate(
    <BrowserRouter>
      <Component />
    </BrowserRouter>,
    container,
    callback,
  );
};

clientSideRender();
