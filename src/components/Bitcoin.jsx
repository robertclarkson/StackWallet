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

export default class Bitcoin extends Component {

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
        <div className="row">
          <div className="col-md-offset-3 col-md-6">
            <div className="bitcoin">
              <h3>Bitcoin</h3>
              <table className="table">
                <tbody>
                  <tr><th>Mnemonic:</th><td>{mnemonic}</td></tr>
                  <tr><th>Address:</th><td>{address}</td></tr>
                  <tr><th>Created:</th><td>{created_at}</td></tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

    ) 
  }

  getAddress (node) {
    var baddress = bitcoin.address
    var bcrypto = bitcoin.crypto

    return baddress.toBase58Check(
      bcrypto.hash160(node.publicKey), 
      bitcoin.networks.testnet.pubKeyHash
    )
  }

  fetchData(){
    this.setState({isLoading:true})
    getFile('btc.json')
      .then((file) => {
        if(file != null) {
          var btc = JSON.parse(file || '[]')
          if(btc.mnemonic){
            var mnemonic = btc.mnemonic
            var seed = bip39.mnemonicToSeed(mnemonic)
            var rootkey = bip32.fromSeed(seed)
            var address = this.getAddress(rootkey.derivePath("m/44'/1'/0'/0/0"))

            this.setState({
              mnemonic:btc.mnemonic,
              address:address,
              created_at:new Date(btc.created_at).toString()
            })
          }

        }
      })
      .catch((e) => {
        console.log('Bitcoin: Error getting bitcoin private key')
        console.log(e);
      })
      .finally(() => {
      })
  }

  componentDidMount() {
    this.fetchData();
  }


  componentWillMount() {
    console.log('bitcoin will mount')
    this.setState({
      person: new Person(loadUserData().profile),
      username: loadUserData().username
    });
  }

}