const React = require('react');
const dom = require('react-dom/server');
const express = require('express');
const serialize = require('serialize-javascript');

const {match, RouterContext} = require('react-router');
const {routes} = require('./app');

const {createStore} = require('redux');
import { Provider } from 'react-redux';
const reducers = require('./reducers');

const app = express();



const Index = props => (
	<div>This is an index page. Whoa.</div>
);


app.use(express.static('public'));

app.get('*', (req, res, next) => {
  match({routes, location: req.url}, (err, redirect, props) => {
    if (err) return next(err);

    if (redirect) {
			return res.redirect(302, redirect.pathname + redirect.search);
		} else if (!props) {
			// 404.
			return next();
    } else {
			// Normal render.
      const store = createStore(reducers);

      Promise.all(props.components
        .map(c => c.getData)
        .filter(getData => !!getData)
        .map(getData => getData(store)))
      .then(() => {
        const markup = dom.renderToString(
          <Provider store={store}>
            <RouterContext {...props} />
          </Provider>
        );
        res.send(`<!DOCTYPE html>
          <body>
          <div id="app">${markup}</div>
          <script>window.__INITIAL_STATE__ = ${serialize(store.getState())};</script>
          <script src="build.js"></script>
          </body>`);
      }).catch(err => next(err));
    }
  });
});

const server = require('http').createServer(app).listen(3003);
server.on('listening', () => {
  console.log('listening on 3003');
});
