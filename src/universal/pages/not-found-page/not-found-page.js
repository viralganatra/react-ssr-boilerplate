import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import './not-found.scss';

const NotFoundPage = () => (
  <section styleName="container">
    <Helmet>
      <title>Not Found Page</title>
    </Helmet>

    <h1 styleName="heading">Not Found Page</h1>

    <Link to="/" href="Home Page">
      <p>Go to Index Page</p>
    </Link>
  </section>
);

export default NotFoundPage;
