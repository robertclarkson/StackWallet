import React, { Component } from 'react'

import ReactDOM from 'react-dom';
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import rootReducer from './reducers'
import App from './components/App.jsx';
import Bitcoin from './components/Bitcoin.jsx';
import Testnet from './components/Testnet.jsx';
import Litecoin from './components/Litecoin.jsx';
import Settings from './components/Settings.jsx';

// Require Sass file so webpack can build it
import bootstrap from 'bootstrap/dist/css/bootstrap.css';
import style from './styles/style.css';

import { BrowserRouter, Router, Route, NavLink, Link, Switch } from 'react-router-dom';

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
	<Provider store={store}>
		{ !isUserSignedIn() ?
	    <Signin handleSignIn={ handleSignIn } />
	    : 
			<PersistGate loading={<div>Loading...</div>} persistor={persistor}>
				<BrowserRouter>
					<div>
						<nav className="navbar navbar-expand-lg navbar-dark bg-primary">
							<Link className="navbar-brand" to="/">Simple Wallet</Link>
							<button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
								<span className="navbar-toggler-icon"></span>
							</button>

							<div className="collapse navbar-collapse" id="navbarSupportedContent">
								<ul className="navbar-nav mr-auto">
									<li className="nav-item">
										<NavLink className="nav-link" to="/" activeClassName="active">Home</NavLink>
									</li>
									<li className="nav-item">
										<NavLink className="nav-link" to="/testnet" activeClassName="active">Testnet</NavLink>
									</li>
									<li className="nav-item">
										<NavLink className="nav-link" to="/bitcoin" activeClassName="active">Bitcoin</NavLink>
									</li>
									<li className="nav-item">
										<NavLink className="nav-link" to="/litecoin" activeClassName="active">Litecoin</NavLink>
									</li>
									<li className="nav-item ml-auto">
										<NavLink className="nav-link" to="/settings" activeClassName="active">Settings</NavLink>
									</li>
								</ul>
							</div>
					    </nav>
					    <switch>
					      <Route path="/testnet" component={Testnet}/>
					      <Route path="/bitcoin" component={Bitcoin}/>
					      <Route path="/litecoin" component={Litecoin}/>
					      <Route path="/settings" component={Settings}/>
					      <Route exact path="/" component={App}/>
					    </switch>
					</div>
				</BrowserRouter>
			</PersistGate>
		}
	</Provider>, document.getElementById('root')
)


// render(
//   <Provider store={store}
//     <App />
//   </Provider>,
//   document.getElementById('root')
// )
