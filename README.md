<div align="center">
<h1>React SSR Boilerplate 📦</h1>
</div>

## What is this?

This is a boilerplate for rendering a React application both on the server and client. It includes support for code-splitting, routing, caching, hot reloading, linting, auto code formatting and more.

## Quick Start

Clone this repo:

```
git clone https://github.com/viralganatra/react-ssr-boilerplate.git
```

Build and run in development mode:

```
npm run start:dev
```

And visit http://localhost:3000 in your browser to see your app.

## Table of Contents

* [What is Included](#what-is-included)
* [Structure](#structure)
* [Adding Pages](#adding-pages)
* [Scripts](#scripts)
* [Hot Reloading](#hot-reloading)
* [Caching](#caching)

## What is Included?

This boilerplate uses the following packages:

* [Babel v6](https://github.com/babel/babel) - ES2015+ transpiling
* [Webpack v3](https://github.com/webpack/webpack) - Bundling/async chunk loading/minification
* [React Loadable v5](https://github.com/thejameskyle/react-loadable) - Component level code-splitting
* [React Router v4](https://github.com/ReactTraining/react-router) - Navigation between pages
* [React Hot Loader v4](https://github.com/gaearon/react-hot-loader) - Auto reloading of code in development
* [React Helmet v5](https://github.com/nfl/react-helmet) - Enable easy changing of the title tag
* [Express v4](https://github.com/expressjs/express) - Server-side rendering
* [App Scripts v1](https://github.com/viralganatra/app-scripts) - ESLint and Prettier

## Structure

The simplified structure of this boilerplate is:

```
my-app
├── config
│   └── webpack
│       ├── client.config.js
│       └── server.config.js
├── server
│   ├── server.development.js
│   └── server.production.js
└── src
    ├── client
    |   └── entry
    |       └── index.js
    ├── server
    |   ├── entry
    |   |   └── index.js
    |   └── components
    |       └── html
    |           └── index.js
    └── universal
        └── app.js
        └── routes
        └── pages
            └── index-page
            └── not-found-page
            └── loading-page
```

### Config

This is where the Webpack config is kept. There are two configs; one for the client and one for the server. The main difference between the two is the client config transpiles code for the browser (last two versions of Chrome) while the server config transpiles code for Node (8.10). They both use [Babel Preset Env](https://babeljs.io/docs/plugins/preset-env/) to automatically transpile code based on the target environment, feel free to modify this to suit your needs.

### Server

The two scripts in this directory are responsible for initialising Express and running the Webpack compiler for the server. React Loadable is also used here to ensure the correct bundles are sent to the client. The development script enables hot reloading for Webpack via [Webpack Hot Middleware](https://github.com/webpack-contrib/webpack-hot-middleware) and [Webpack Hot Server Middleware](https://github.com/60frames/webpack-hot-server-middleware).

### Src

This directory is where all source code is kept. There are three subfolders; ```server```, ```client``` and ```universal```.

#### Client

The ```client/entry/index.js``` file is responsible for mounting the app and hydrating the state from the server. The entrypoints for hot module reloading and navigation are initialised here.

#### Server

The ```server/entry/index.js``` serves a similar purpose as the client, except is uses the [renderToNodeStream](https://reactjs.org/docs/react-dom-server.html#rendertonodestream) method from React to render the app.

The ```server/components/html/index.js``` file acts as the main HTML file that is loaded when visiting any page. The initial Javascript is loaded here, split into three files; bootstrap, vendor and main. The bootstrap script contains references to the modules needed to load the app, the vendor script contains all the non-app code (i.e. libraries in node_modules) and the main script contains all the app code.

This is setup this way to help with caching and performance, in production a unique hash is added to each script. If you only make changes to your app code it doesn't make sense to re-download the vendor script. Because of this the browser can skip the vendor script as the url is the same.

### Universal

This is where all the app code that is used both on the server and client side is kept. The ```app/index.js``` is the entrypoint to the app. Within this directory are ```pages``` and ```routes``` which we will cover next.

## Adding Pages

### Step 1

Create a new directory under ```src/universal/pages```, e.g. contact-page.

### Step 2

Under this directory create a new file named ```contact-page.js```. Use the following code as an example:

```jsx
import React from 'react';
import { Helmet } from 'react-helmet';

const ContactPage = () => (
  <section>
    <Helmet>
      <title>Contact Page</title>
    </Helmet>

    <h1>Contact Page</h1>
  </section>
);

export default ContactPage;
```

### Step 3

In the same directory create ```index.js``` and add the following:

```jsx
import Loadable from 'react-loadable';
import ContactPage from 'universal/pages/contact-page';

export default Loadable({
  loader: () => import('./contact-page'),
  loading: ContactPage,
});
```

This tells React Loadable to code-split this component and to load it on-demand.

> You don't have to use React Loadable here, you can simply export the componemt. In that case the component will not be code-split and it will be bundled as part of the main app bundle.

### Step 4

Add a new reference to this page in the routes file. Edit ```src/universal/routes/index.js``` and add:

```jsx
import React from 'react';
import { Route, Switch } from 'react-router-dom';
import IndexPage from 'universal/pages/index-page';
import NotFoundPage from 'universal/pages/not-found-page';
import ContactPage from 'universal/pages/contact-page';

const Routes = () => (
  <Switch>
    <Route exact path="/" component={IndexPage} />
    <Route exact path="/contact" component={ContactPage} />
    <Route component={NotFoundPage} />
  </Switch>
);

export default Routes;
```

### Step 5

Visit http://localhost:3000/contact to see your new page.

## Scripts

### Start Scripts

There are two start scripts available:

### ```npm run start:dev``` or ```yarn run start:dev```

Starts the app in development mode. Visit http://localhost:3000 in your browser to see your app. This will enable hot reloading and the Chrome debugger.

### ```npm run start:prod``` or ```yarn run start:prod```

Starts the app in production mode. This will build the app, minify the assets and run the app with the ```NODE_ENV``` set to ```production```.

### Util Scripts

There are some utility scripts that are used by both start scripts:

### ```clean:dev``` and ```clean:prod```

These two scripts delete and re-create the folders where the generated transpiled code is kept for both the client and the server.

### ```webpack:client:dev``` and ```webpack:client:prod```

These two scripts run Webpack for the client side and generate a JSON file containing data about the modules. This is then used by the React Loadable plugin to make sure that the client loads all the modules that were rendered server-side.

### ```webpack:server:dev``` and ```webpack:server:prod```

Similar to the ```webpack:client:*``` scripts, these run Webpack except for use on the server. The Webpack server config generates the file ```serverSideRender.js``` which is then used by express to serve the modules.

### ```node:dev``` and ```node:prod```

Run Node with Express on the server. In dev mode it runs Node with the ```---inspect``` flag to enable debugging.

### App Scripts

The app-scripts package configures ESLint and Prettier automatically. Prettier is configured so whenever a commit is made it will automatically run and format the staged files.

## Hot Reloading

Out of the box this boilerplate supports hot reloading of components in development mode using React Hot Loader. There should be no extra work for you to do, simply add new components and they will automatically update when you save your code. If you wish to modify the behaviour the entrypoint file is located at:

```src/client/entry/index.js```

## Caching

This boilerplate is configured to support auto file-caching in production. All generated files, or "chunks", from the Webpack configs have a unique hash as part of the name, e.g.

```
main.2de1ad15a6e381913e99.js
```

By default there are 3 Javascript files generated:

* Runtime - this contains a reference to all possible chunks
* Vendor - this contains all the libraries from ```node_modules```
* Main - the main application code

In addition, for each React Loadable dynamic import there is a file generated. So by default two; one for the index page and one for the not found page.

The files are split this way to ensure the best possible performance. For example, if you only change code in the index page it would make no sense to re-download all the files the following time. Instead, when the start:prod script finishes only that particular file has the unique hash updated; the rest are left alone. This way the browser can continue to use the already cached files.

## License

[MIT](LICENSE)
