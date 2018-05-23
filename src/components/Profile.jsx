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
var bip39 = require('bip39')
var bip32 = require('bip32')

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
      mnemonic:"",
      address:""
  	};
  }

  render() {
    const { handleSignOut } = this.props;
    const { person } = this.state;
    const { username } = this.state;
    const { address } = this.state;
    const { created_at } = this.state;
    const { mnemonic } = this.state;
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
                      <tr><th>Mnemonic:</th><td>{mnemonic}</td></tr>
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

                  <button 
                    className="btn btn-info" 
                    onClick={e => this.handleAdd(e)}
                  >
                    Add Crypto
                  </button>
                </div>
              }
            </div>
          </div>
        </div>
      </div> : null
    );
  }

  getAddress (node) {
    var baddress = bitcoin.address
    var bcrypto = bitcoin.crypto
    return baddress.toBase58Check(bcrypto.hash160(node.publicKey), bitcoin.networks.bitcoin.pubKeyHash)
  }

  fetchData(){
    this.setState({isLoading:true})

    const constants = require('bip44-constants')
    console.log(constants)
     
    // // iterate through constants
    // Object.keys(constants).forEach(coin => {
    //   const constant = constants[coin]
     
    //   // ...
    //   console.log(coin, constant)
    // })
     
    // console.log(constants['Litecoin'])


    getFile('btc.json')
      .then((file) => {
        if(file != null) {
          //we got a btc file from the user, get the WIF and make address
          console.log('setting state');
          console.log(file);
          var btc = JSON.parse(file || '[]')
          if(btc.mnemonic){
            // var keyPair = bitcoin.ECPair.fromWIF(btc.wif, bitcoin.networks.testnet)
            // var address = keyPair.getAddress()

            // var mnemonic = bip39.generateMnemonic()
            var mnemonic = btc.mnemonic
            var seed = bip39.mnemonicToSeed(mnemonic)
            var rootkey = bip32.fromSeed(seed)
            var address = this.getAddress(rootkey.derivePath("m/0'/0/0"))
            this.setState({
              mnemonic:btc.mnemonic,
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
    // var testnet = bitcoin.networks.testnet
    // var keyPair = bitcoin.ECPair.makeRandom({ network: testnet});
    // var wif = keyPair.toWIF();
    // var address = keyPair.getAddress()

    var mnemonic = bip39.generateMnemonic()
    var seed = bip39.mnemonicToSeed(mnemonic)
    var rootkey = bip32.fromSeed(seed)
    var address = this.getAddress(rootkey.derivePath("m/0'/0/0"))
    let btc = {
      mnemonic: mnemonic,
      created_at: Date.now()
    }
    putFile('btc.json', JSON.stringify(btc))
      .then(() => {
        this.setState({
          mnemonic:mnemonic,
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

  handleAdd() {
    this.setState({

    });
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
