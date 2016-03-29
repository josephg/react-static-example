import React from 'react';
import ReactDOM from 'react-dom';
import { Router } from 'react-router';
import { createStore } from 'redux'
import { Provider } from 'react-redux'
import { browserHistory } from 'react-router'

import { routes } from './app';
const reducers = require('./reducers');

const store = createStore(reducers, window.__INITIAL_STATE__);

const onUpdate = function() {
  this.state.components.forEach(c => {
    if (c.getData) c.getData(store);
  });
};

ReactDOM.render(
  <Provider store={store}>
    <Router routes={routes} history={browserHistory} onUpdate={onUpdate} />
  </Provider>,
  document.getElementById('app')
);
