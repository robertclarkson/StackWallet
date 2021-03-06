import React, { Component, Link } from 'react';
import Bitcoin from './Bitcoin.jsx';
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

export default class Testnet extends Bitcoin {
	
	getClassName() {
		return 'Testnet'
	}


	getAddress (node) {
		var baddress = bitcoin.address
		var bcrypto = bitcoin.crypto

		return baddress.toBase58Check(
			bcrypto.hash160(node.publicKey), 
			bitcoin.networks.testnet.pubKeyHash
		)
	}

	getTransactions(address, component) {
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
	        component.setState({
	          txs: transactions,
	        });
	      // console.log(transactions)
	    })
	}

	getTxs(address, component) {
	    dhttp({
	      method: 'GET',
	      url: 'https://test-insight.bitpay.com/api/addr/'+address+'/utxo',
	      // url: 'https://insight.bitpay.com/api/addr/'+address,
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
}