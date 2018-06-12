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

  getClassName() {
    return 'Bitcoin'
  }

  render() {
    const { mnemonic, address, txs, created_at } = this.state;
    console.log('transactions',txs);
    return (
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6 ">
            <div className="bitcoin">
              <h3>{this.getClassName()}</h3>
              {this.state.isLoading && <h1>Loading...</h1>}
              {!this.state.isLoading &&
                <table className="table">
                  <tbody>
                    <tr><th>Mnemonic:</th><td>{mnemonic}</td></tr>
                    <tr><th>Address:</th><td>{address}</td></tr>
                    <tr><th>Balance:</th><td>{txs ? txs.balance : 'loading...'}</td></tr>
                    <tr><th>Created:</th><td>{created_at}</td></tr>
                  </tbody>
                </table>
              }
            </div>

            
          </div>
        </div>
      </div>

    ) 
  }

  getCoinIndex(tla = 'BTC') {
    return (cointypes[tla] - cointypes['BTC'])
  }

  getAddress (node) {
    var baddress = bitcoin.address
    var bcrypto = bitcoin.crypto

    return baddress.toBase58Check(
      bcrypto.hash160(node.publicKey), 
      bitcoin.networks.bitcoin.pubKeyHash
    )
  }

  getTransactions(address, component) {
    dhttp({
      method: 'GET',
      // url: 'https://test-insight.bitpay.com/api/addr/'+address,
      url: 'https://insight.bitpay.com/api/addr/'+address,
      /*body: {
        addrs: [address],
        height: 0
      }*/
    }, function (err, transactions) {
      if (err) console.log(err)
        component.setState({
          txs: transactions,
        });
      // console.log(transactions)
    })
  }

  getTxs(address, component) {
      dhttp({
        method: 'GET',
        url: 'https://insight.bitpay.com/api/addr/'+address+'/utxo',
        // url: 'https://insight.bitpay.com/api/addr/'+address,
        /*body: {
          addrs: [address],
          height: 0
        }*/
      }, function (err, transactions) {
        if (err) console.log(err)
          // console.log(transactions)
          component.setState({
            addrtxs: transactions,
          });
        // console.log(transactions)
      })
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
            var txs = this.getTransactions(address, this)
            // var trans = this.getTxs(address, this)

            this.setState({
              mnemonic:btc.mnemonic,
              address:address,
              txs:txs,
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