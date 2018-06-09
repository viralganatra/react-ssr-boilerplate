import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import './index.scss';

const IndexPage = () => (
  <section styleName="container">
    <Helmet>
      <title>Index Page</title>
    </Helmet>

    <h1 styleName="heading">Index Page</h1>

    <Link to="/not-found" href="Not Found Page">
      <p>Go to Not Found Page</p>
    </Link>
  </section>
);

export default IndexPage;
