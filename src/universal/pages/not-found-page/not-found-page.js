import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';

const NotFoundPage = () => (
  <section style={{ backgroundColor: '#FFEB3B' }}>
    <Helmet>
      <title>Not Found Page</title>
    </Helmet>

    <h1>Not Found Page</h1>

    <Link to="/" href="Home Page">
      <p>Go to Index Page</p>
    </Link>
  </section>
);

export default NotFoundPage;
