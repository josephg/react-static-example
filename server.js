const React = require('react');
const dom = require('react-dom/server');
const express = require('express');
const serialize = require('serialize-javascript');

const {match, RouterContext} = require('react-router');
const {routesWithStore} = require('./app');

const {createStore} = require('redux');
import { Provider } from 'react-redux';
const reducers = require('./reducers');

import {StyleSheetServer} from 'aphrodite';


const app = express();

const Index = props => (
  <div>This is an index page. Whoa.</div>
);


app.use(express.static('public'));

app.get('*', (req, res, next) => {
  if (req.location === '/404') return next();

  const store = createStore(reducers);
  match({routes:routesWithStore(store), location: req.url}, (err, redirect, props) => {
    if (err) return err === 404 ? next() : next(err);

    if (redirect) {
      // if (redirect.pathname === '/404') return next();
      return res.redirect(302, redirect.pathname + redirect.search);
    } else if (!props) {
      // 404.
      return next();
    } else {
      // Normal render.
      if (req.url === '/404') res.status(404);

      const {html, css} = StyleSheetServer.renderStatic(() =>
        dom.renderToString(
          <Provider store={store}>
            <RouterContext {...props} />
          </Provider>
      ));

      console.log('server css object is', css);
      res.send(`<!DOCTYPE html>
        <head>
          <style data-aphrodite>${css.content}</style>
        </head>
        <body>
        <div id="app">${html}</div>
        <script>
          window.__INITIAL_STATE__ = ${serialize(store.getState())};
          window.__CSS_NAMES__ = ${JSON.stringify(css.renderedClassNames)};
        </script>
        <script src="/build.js"></script>
        </body>`);
      // }).catch(err => next(err));
    }
  });
});

const server = require('http').createServer(app).listen(3003);
server.on('listening', () => {
  console.log('listening on 3003');
});
