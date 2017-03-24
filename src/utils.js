var http = require("http");
var _ = require("lodash");
var axios = require("axios");
var EthereumTx = require("ethereumjs-tx");

const API_URL = process.env.API_URL || 'http://localhost:3000';
const PRIVATE_KEY = process.env.PRIVATE_KEY || '';
const FROM_ADDRESS = process.env.FROM_ADDRESS || '';
const CHAINID = process.env.CHAINID || 42; // kovan

export const sign = function(tokenAddress, amount, complierAddress) {
  if (FROM_ADDRESS == '' || PRIVATE_KEY == '') {
    return new Promise((resolve, reject) => {
      reject('NOT PRIVATE KEY');
    });
  }
  return axios.get(API_URL +'/count/'+ FROM_ADDRESS)
    .then(results => results.data.count)
    .then((count) => {
      const privateKey = Buffer.from(PRIVATE_KEY, 'hex');
      const txParams = {
        nonce: '0x'+ Number(count).toString(16),
        gasPrice: 20000000000,
        gasLimit: 60000,
        from: FROM_ADDRESS,
        to: complierAddress,
        data: '0x9dc29fac000000000000000000000000'+ tokenAddress.replace(/^0x/, '') + _.padStart(Number(amount).toString(16), 64, '0'),
        chainId: Number(CHAINID)
      };
      const tx = new EthereumTx(txParams);
      tx.sign(privateKey);
      return tx.serialize().toString('hex');
    })
}
