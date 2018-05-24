import React, { Component } from 'react'

import ReactDOM from 'react-dom';
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import rootReducer from './reducers'
import App from './components/App.jsx';
import Bitcoin from './components/Bitcoin.jsx';

// Require Sass file so webpack can build it
import bootstrap from 'bootstrap/dist/css/bootstrap.css';
import style from './styles/style.css';
import { BrowserRouter, Router, Route, Link } from 'react-router-dom';


import createBlockstackStore from "redux-persist-blockstack";
import { compose, applyMiddleware, createStore } from "redux";
import * as blockstack from "blockstack";
import { persistStore, persistCombineReducers, persistReducer } from "redux-persist";

import { PersistGate } from 'redux-persist/integration/react'
import Signin from './components/Signin.jsx';

import {
  isSignInPending,
  isUserSignedIn,
  redirectToSignIn,
  handlePendingSignIn,
  signUserOut,
} from 'blockstack';


const storage = createBlockstackStore(blockstack);
const config = {
    key: "root",
    storage
};

const reducer = persistReducer(config, rootReducer);

const store = !isUserSignedIn() ? createStore(rootReducer) : createStore(reducer);

const persistor = persistStore(store);
const handleSignIn = (e) => {
	e.preventDefault();
	redirectToSignIn();
}
if (isSignInPending()) {
  handlePendingSignIn().then((userData) => {
    window.location = window.location.origin;
  });
}
ReactDOM.render(
	<BrowserRouter>
		<Provider store={store}>
			{ !isUserSignedIn() ?
            <Signin handleSignIn={ handleSignIn } />
            : 
				<PersistGate loading={<div>Loading...</div>} persistor={persistor}>
					<div>
						<nav>
					      <Link to="/">Home</Link>
					      <Link to="/bitcoin">Bitcoin</Link>
					    </nav>
					    <div>
					      <Route path="/bitcoin" component={Bitcoin}/>
					      <Route path="/" component={App}/>
					    </div>
					</div>
				</PersistGate>
			}
		</Provider>
	</BrowserRouter>, document.getElementById('root')
);


// render(
//   <Provider store={store}>
//     <App />
//   </Provider>,
//   document.getElementById('root')
// )
