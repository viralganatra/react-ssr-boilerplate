import React from 'react';
import { Helmet } from 'react-helmet';

const LoadingPage = () => (
  <section style={{ backgroundColor: '#4CAF50' }}>
    <Helmet>
      <title>Loading...</title>
    </Helmet>

    <p>Loading...</p>
  </section>
);

export default LoadingPage;
