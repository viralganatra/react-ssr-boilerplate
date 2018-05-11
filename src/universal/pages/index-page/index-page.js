import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';

const IndexPage = () => (
  <section style={{ backgroundColor: '#03A9F4' }}>
    <Helmet>
      <title>Index Page</title>
    </Helmet>

    <h1>Index Page</h1>

    <Link to="/not-found" href="Not Found Page">
      <p>Go to Not Found Page</p>
    </Link>
  </section>
);

export default IndexPage;
