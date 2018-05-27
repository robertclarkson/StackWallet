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

  fetchData(){
    this.setState({isLoading:true})
    getFile('btc.json')
      .then((file) => {
        if(file != null) {
          var btc = JSON.parse(file || '[]')
          if(btc.mnemonic){
            var mnemonic = btc.mnemonic
            this.setState({
              mnemonic:btc.mnemonic,
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
      })
      .catch((e) => {
        console.log('Bitcoin: Error getting bitcoin private key')
        console.log(e);
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
    // var seed = bip39.mnemonicToSeed(mnemonic)
    // var rootkey = bip32.fromSeed(seed)
    // var address = this.getAddress(rootkey.derivePath("m/44'/1'/0'/0/0"))
    // var addresses = [
    //   this.getAddress(rootkey.derivePath("m/44'/0'/0'/0/0")),
    //   this.getAddress(rootkey.derivePath("m/44'/1'/0'/0/0"))
    // ]
    
    let btc = {
      mnemonic: mnemonic,
      created_at: Date.now()
    }
    putFile('btc.json', JSON.stringify(btc))
      .then(() => {
        // this.setState({
        //   mnemonic:mnemonic,
        //   address:address,
        //   created_at:new Date(btc.created_at).toString()
        // })
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

}