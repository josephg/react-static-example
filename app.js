import React from 'react';
import {Link} from 'react-router';
import {connect} from 'react-redux';

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

const Index = props => (
	<div>This is an index page. Whoa.</div>
);

const about = () => (
  <h1>About page!</h1>
);

const About = connect((state) => ({}))(about);


// 1
// const dancing = ({x}) => <h1>Dancing! {x}</h1>;

// 2
// const dancing = ({x}) => {
// 	if (x == null) {
// 		return <h1>Loading...</h1>;
// 	} else {
// 		return <h1>Dancing page! {x}</h1>
// 	}
// };

// 3
const dancing = React.createClass({
	getDefaultProps() {
		return {x:0};
	},
	render() {
		return <h1>Dancing {this.props.x}</h1>;
	}
});

const Dancing = connect((state) => ({x:state.x}))(dancing);

Dancing.getData = store => new Promise((resolve, reject) => {
	console.log('dance get data', store.getState());
	if (store.getState().x == null) {
		// get x.
		setTimeout(() => {
			store.dispatch({type: 'SETX', x: 10});
			resolve();
			console.log('ok done', store.getState());
		}, 500);
	} else {
		resolve();
	}
});

exports.routes = {
  path: '',
  component: App,
  childRoutes: [
    { path: '/', component: Index },
    { path: '/about', component: About },
    { path: '/dancing', component: Dancing }
  ]
};
