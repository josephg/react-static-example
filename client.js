import React from 'react';
import ReactDOM from 'react-dom';
import { match, browserHistory, Router } from 'react-router';

import { createStore } from 'redux'
import { Provider } from 'react-redux'

import { routesWithStore } from './app';
const reducers = require('./reducers');

const store = createStore(reducers, window.__INITIAL_STATE__);
const routes = routesWithStore(store);

const onError = function(err) {
  console.error(err);
};

match({history:browserHistory, routes}, (err, redirect, props) => {
  ReactDOM.render(
    <Provider store={store}>
      <Router {...props} onUpdate={onUpdate} onError={onError} />
    </Provider>,
    document.getElementById('app')
  );
});
