import React from 'react';
import {Link} from 'react-router';
import {connect} from 'react-redux';

import {StyleSheet, css} from 'aphrodite';

// import jss from 'jss';

class Renderer {
  static style() {}
  attach() {
    console.log('attach');
  }
  detach() {}
  deploy() {}
  insertRule() {}
  getRules() {
    console.log('getRules');
    return {};
  }
}

const App = ({children}) => (
  <div>
    <h2>Ermagherd</h2>
    { children }
    <Link to="/about">About</Link>
    <br />
    <Link to="/dancing">Dance</Link>
    <br />
    <Link to="/">home</Link>
  </div>
);

const RedBox = ({sheet}) => (
  <div className={css(styles.redBox)}></div>
);

const styles = StyleSheet.create({
  redBox: {
    height: "100px",
    width: "100px",
    backgroundColor: 'red',
  }
});

// App.getData = (store) => {throw Error("omg error")};

const Index = props => (
  <div>
    This is an index page. Whoa.
    <RedBox />
  </div>
);

const about = ({y}) => (
  <h1>About page! Y is {y}</h1>
);

const About = connect((state) => ({y:state.y}))(about);


// 1
// const dancing = ({x}) => <h1>Dancing! {x}</h1>;

// 2
// const dancing = ({x}) => {
//   if (x == null) {
//     return <h1>Loading...</h1>;
//   } else {
//     return <h1>Dancing page! {x}</h1>
//   }
// };

// 3
const dancing = React.createClass({
  getDefaultProps() {
    return {x:0};
  },
  render() {
    console.log(this.props, this.state);
    return <h1>Dancing {this.props.x}</h1>;
  },

  otherStuff() {
    return 10;
  },
});

dancing.getData = (store) => {
  if (store.getState().x != null) return Promise.resolve();

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      store.dispatch({type: 'SETX', x: 10});
      resolve();
      console.log('ok done', store.getState());
    }, 500);
  });
};

const Dancing = connect((state) => ({x:state.x}))(dancing);

Dancing.getData = dancing.getData;

const WithArg = ({params}) => {
  return <p>{params.bar}</p>
}

About.getData = store => {
  // Triggers onError.
  // return Promise.reject(new Error('blah'));

  // Triggers 404.
  return Promise.reject();

  // return Promise.resolve();
}

const load = store => function(nextState, replace, callback) {
  const getData = this.component.getData;
  if (getData) try {
    getData(store).then(
      () => callback(),
      (err) => {
        if (!err) {
          // 404.
          // The server will understand this and reply with a 404 immediately.
          // (Instead of redirecting via /404).
          if (process.title !== 'browser') err = 404;
          else replace('/404');
        }
        callback(err);
      });
  } catch (e) { console.log('1'); callback(e); }
};

const NotFound = () => <h1>Page not Found! Oh. My. God.</h1>;

exports.routesWithStore = store => ({
  path: '',
  component: App,
  childRoutes: [
    { path: '/', component: Index },
    {
      path: '/about',
      component: About,
      onEnter: load(store)
    },
    { path: '/dancing', component: Dancing, onEnter: load(store), x:5 },
    { path: '/foo/:bar', component: WithArg },
    { path: '/404', component: NotFound }
  ]
});
