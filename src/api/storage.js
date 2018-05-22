import {
  getFile
} from 'blockstack';

export default {
  getCryptos: () => {
  	getFile('cryptos.json')
      .then((file) => {
        if(file != null) {
          var cryptos = JSON.parse(file || '[]')
          return cryptos;
        }
        else {
        	console.log('no cryptos found');
        	return false;
        }
        // console.log(wif);
        // console.log(address);
      })
      .catch((e) => {
        console.log(e);
          console.log('Error getting cryptos')
      })
      .finally(() => {
      })
  }

}
