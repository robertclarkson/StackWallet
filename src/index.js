import React, { Component } from 'react'

import ReactDOM from 'react-dom';
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import rootReducer from './reducers'
import App from './components/App.jsx';

// Require Sass file so webpack can build it
import bootstrap from 'bootstrap/dist/css/bootstrap.css';
import style from './styles/style.css';
import { BrowserRouter } from 'react-router-dom';

import createBlockstackStore from "redux-persist-blockstack";
import { compose, applyMiddleware, createStore } from "redux";
import * as blockstack from "blockstack";
import { persistStore, persistCombineReducers, persistReducer } from "redux-persist";

import { PersistGate } from 'redux-persist/integration/react'

const storage = createBlockstackStore(blockstack);
const config = {
    key: "root",
    storage
};

const reducer = persistReducer(config, rootReducer);

const store = createStore(reducer);
const persistor = persistStore(store);

ReactDOM.render(
	<BrowserRouter>
		<Provider store={store}>
			<PersistGate loading={<div>Loading...</div>} persistor={persistor}>
				<App />
			</PersistGate>
		</Provider>
	</BrowserRouter>, document.getElementById('root'));




// render(
//   <Provider store={store}>
//     <App />
//   </Provider>,
//   document.getElementById('root')
// )
