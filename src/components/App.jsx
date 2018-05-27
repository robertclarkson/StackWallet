import React, { Component, Link } from 'react';
import Profile from './Profile.jsx';
import Signin from './Signin.jsx';
import Footer from './Footer'
import AddTodo from '../containers/AddTodo'
import VisibleTodoList from '../containers/VisibleTodoList'
import FooterContainer from '../containers/FooterContainer'

import {
  isSignInPending,
  isUserSignedIn,
  redirectToSignIn,
  handlePendingSignIn,
  signUserOut,
} from 'blockstack';

export default class App extends Component {

  constructor(props) {
  	super(props);
  }

  handleSignIn(e) {
    e.preventDefault();
    redirectToSignIn();
  }

  handleSignOut(e) {
    e.preventDefault();
    signUserOut(window.location.origin);
  }

  render() {
    return (
      <div className="container">
        { !isUserSignedIn() ?
          <Signin handleSignIn={ this.handleSignIn } />
          : <div>
              <Profile handleSignOut={ this.handleSignOut } />
              {/*<div className="col-md-offset-3 col-md-6">
                  <AddTodo />
                  <VisibleTodoList />
                  <FooterContainer />
                </div>*/}
            </div>
        }
      </div>
    );
  }

  componentWillMount() {
    if (isSignInPending()) {
      handlePendingSignIn().then((userData) => {
        window.location = window.location.origin;
      });
    }
  }
}
