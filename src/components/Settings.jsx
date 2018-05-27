import React, { Component, Link } from 'react';
import {
  isSignInPending,
  loadUserData,
  Person,
  getFile,
  putFile,
  deleteFile
} from 'blockstack';

let bitcoin = require('bitcoinjs-lib')
var bip39 = require('bip39')
var bip32 = require('bip32')
const cointypes = require('bip44-constants')
var dhttp = require('dhttp/200')

export default class Settings extends Component {

  constructor(props) {
    super(props);

    this.state = {
      person: {
        name() {
          return 'Anonymous';
        },
        avatarUrl() {
          return avatarFallbackImage;
        },
      },
      username: "",
      mnemonic:"",
      address:""
    };
  }

  render() {
    const { mnemonic, address, created_at } = this.state;
    
    return (
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6 ">
            <div className="bitcoin">
              <h3>Settings</h3>
              {this.state.isLoading && <h1>Loading...</h1>}
              {!this.state.isLoading &&
                <table className="table">
                  <tbody>
                    <tr><th>Mnemonic:</th><td>{mnemonic}</td></tr>
                    <tr><th>Address:</th><td>{address}</td></tr>
                    <tr><th>Created:</th><td>{created_at}</td></tr>
                  </tbody>
                </table>
              }
            </div>

            <button 
              className="btn btn-danger" 
              onClick={e => this.handleDelete(e)}
            >
              Delete
            </button>

            <button 
              className="btn btn-info" 
              onClick={e => this.handleAdd(e)}
            >
              Add Crypto
            </button>
          </div>
        </div>
      </div>

    ) 
  }

  
  handleDelete() {
    putFile('btc.json', JSON.stringify([]))
      .finally(() => {
        this.setState({isLoading:false})
        this.fetchData();
      })
  }


}