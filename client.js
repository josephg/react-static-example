import React from 'react';
import ReactDOM from 'react-dom';
import { match, browserHistory, Router } from 'react-router';

import { createStore } from 'redux'
import { Provider } from 'react-redux'

import { routesWithStore } from './app';

import {StyleSheet} from 'aphrodite';

const reducers = require('./reducers');

const store = createStore(reducers, window.__INITIAL_STATE__);
const routes = routesWithStore(store);

const onError = function(err) {
  console.error(err);
};

StyleSheet.rehydrate(window.__CSS_NAMES__);
match({history:browserHistory, routes}, (err, redirect, props) => {
  ReactDOM.render(
    <Provider store={store}>
      <Router {...props} onError={onError} />
    </Provider>,
    document.getElementById('app')
  );
});
