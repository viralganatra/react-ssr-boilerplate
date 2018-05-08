import React from 'react';
import { Route, Switch } from 'react-router-dom';
import IndexPage from 'universal/pages/index-page';
import NotFoundPage from 'universal/pages/not-found-page';

export const Routes = () => (
  <Switch>
    <Route exact path="/" component={IndexPage} />
    <Route component={NotFoundPage} />
  </Switch>
);

export default Routes;
