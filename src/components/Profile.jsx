import React, { Component } from 'react';
import {
  isSignInPending,
  loadUserData,
  Person,
  getFile,
  putFile,
  deleteFile
} from 'blockstack';

let bitcoin = require('bitcoinjs-lib')

const avatarFallbackImage = 'https://s3.amazonaws.com/onename/avatar-placeholder.png';

export default class Profile extends Component {
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
      wif:"",
      address:"",
  	};
  }

  render() {
    const { handleSignOut } = this.props;
    const { person } = this.state;
    const { username } = this.state;
    const { address } = this.state;
    const { created_at } = this.state;
    const { wif } = this.state;
    return (
      !isSignInPending() ?
      <div className="container">
        <div className="row">
          <div className="col-md-offset-3 col-md-6">
            <div className="col-md-12">
              <div className="avatar-section">
                <img
                  src={ person.avatarUrl() ? person.avatarUrl() : avatarFallbackImage }
                  className="img-rounded avatar"
                  id="avatar-image"
                />
                <div className="username">
                  <h1>
                    <span id="heading-name">{ person.name() ? person.name()
                      : 'Nameless Person' }</span>
                    </h1>
                  <span>{username}</span>
                  <span>
                    &nbsp;|&nbsp;
                    <button
                      className="btn btn-primary btn-sm"
                      id="signout-button"
                      onClick={ handleSignOut.bind(this) }
                    >
                      Logout
                    </button>
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="bitcoin">
            <div className="col-md-offset-3 col-md-6">
              {this.state.isLoading && <h1>Loading...</h1>}
              {!this.state.isLoading &&
                <div className="bitcoin">
                  <h3>Bitcoin</h3>
                  <table className="table">
                    <tbody>
                      <tr><th>WIF:</th><td>{wif}</td></tr>
                      <tr><th>Address:</th><td>{address}</td></tr>
                      <tr><th>Created:</th><td>{created_at}</td></tr>
                    </tbody>
                  </table>
                  <button 
                    className="btn btn-danger" 
                    onClick={e => this.handleDelete(e)}
                  >
                    Delete
                  </button>
                </div>
              }
            </div>
          </div>
        </div>
      </div> : null
    );
  }

  fetchData(){
    this.setState({isLoading:true})
    getFile('btc.json')
      .then((file) => {
        if(file != null) {
          //we got a btc file from the user, get the WIF and make address
          console.log('setting state');
          console.log(file);
          var btc = JSON.parse(file || '[]')
          if(btc.wif){
            var keyPair = bitcoin.ECPair.fromWIF(btc.wif)
            var address = keyPair.getAddress()

            this.setState({
              wif:btc.wif,
              address:address,
              created_at:new Date(btc.created_at).toString()
            })
          }
          else {
            this.makeBitcoinFile()
          }
        }
        else {
          this.makeBitcoinFile();
        }
        // console.log(wif);
        // console.log(address);
      })
      .catch((e) => {
        console.log(e);
          console.log('Error getting bitcoin private key')
      })
      .finally(() => {
        this.setState({isLoading:false})
      })
  }

  makeBitcoinFile() {
    console.log('no bitcoin saved file, creating new one')
    var keyPair = bitcoin.ECPair.makeRandom();
    var wif = keyPair.toWIF();
    var address = keyPair.getAddress()
    let btc = {
      wif: wif,
      created_at: Date.now()
    }
    putFile('btc.json', JSON.stringify(btc))
      .then(() => {
        this.setState({
          wif:wif,
          address:address,
          created_at:new Date(btc.created_at).toString()
        })
      })
  }

  handleDelete() {
    putFile('btc.json', JSON.stringify([]))
      .finally(() => {
        this.setState({isLoading:false})
        this.fetchData();
      })
  }

  componentDidMount() {
    this.fetchData();
  }


  componentWillMount() {
    this.setState({
      person: new Person(loadUserData().profile),
      username: loadUserData().username
    });
  }
}
