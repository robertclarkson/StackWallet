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
const cointypes = require('bip44-constants')

var dhttp = require('dhttp/200')
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
      address:"",
      addresses:[]
  	};
  }

  render() {
    const { handleSignOut } = this.props;
    const { person } = this.state;
    const { username } = this.state;
    const { address } = this.state;
    const { addresses } = this.state;
    const { created_at } = this.state;
    const { mnemonic } = this.state;
    return (
      !isSignInPending() ?
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6 jumbotron">
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
        </div>
      </div> : null
    );
  }

  getCoinIndex(tla = 'BTC') {
    return (cointypes[tla] - cointypes['BTC'])
  }

  getAddress (node) {
    var baddress = bitcoin.address
    var bcrypto = bitcoin.crypto

    return baddress.toBase58Check(
      bcrypto.hash160(node.publicKey), 
      bitcoin.networks.testnet.pubKeyHash
    )
  }

  getTransactions(address) {
    dhttp({
      method: 'GET',
      url: 'https://test-insight.bitpay.com/api/addr/'+address,
      // url: 'https://insight.bitpay.com/api/addr/'+address,
      /*body: {
        addrs: [address],
        height: 0
      }*/
    }, function (err, transactions) {
      if (err) console.log(err)

      console.log(transactions)
    })
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
          if(btc.mnemonic){
            // var keyPair = bitcoin.ECPair.fromWIF(btc.wif, bitcoin.networks.testnet)
            // var address = keyPair.getAddress()

            // var mnemonic = bip39.generateMnemonic()
            var mnemonic = btc.mnemonic
            var seed = bip39.mnemonicToSeed(mnemonic)
            var rootkey = bip32.fromSeed(seed)
            var address = this.getAddress(rootkey.derivePath("m/44'/1'/0'/0/0"))
            
            this.getTransactions(address);

            //m / purpose' / coin_type' / account' / change / address_index
            //m/44'/0'/0'/0/0
            var addresses = [
              this.getAddress(rootkey.derivePath("m/44'/0'/0'/0/0")),
              this.getAddress(rootkey.derivePath("m/44'/1'/0'/0/0")),
              this.getAddress(rootkey.derivePath("m/44'/2'/0'/0/0")),
              this.getAddress(rootkey.derivePath("m/44'/3'/0'/0/0")),
            ]
            
            this.setState({
              mnemonic:btc.mnemonic,
              address:address,
              addresses:addresses,
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
        console.log('Error getting bitcoin private key')
        console.log(e);
      })
      .finally(() => {
        this.setState({isLoading:false})
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
