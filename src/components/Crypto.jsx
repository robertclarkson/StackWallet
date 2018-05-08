import React, { Component } from 'react';

export default class Crypto extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name:"", //Bitcoin
      code:"", //BTC
      wif:"", //private key in wallet import format
      isLoading: false
    };
  }

  render() {
    const { code } = this.state;
    const { wif } = this.state;

    return (
      <div className="panel-landing" id={code}>
        <table className="table">
          <tr><th>Name</th><td>{name}</td></tr>
          <tr><th>Code</th><td>{code}</td></tr>
          <tr><th>WIF</th><td>{wif}</td></tr>
        </table>
      </div>
    );
  }
}
