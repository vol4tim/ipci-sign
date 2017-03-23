var http = require("http");
var _ = require("lodash");
var EthereumTx = require("ethereumjs-tx");

const sign = function(tokenAddress, amount, complierAddress, accountAddress) {
  var options = {
      host: 'localhost',
      port: '3000',
      path: '/count/'+ accountAddress
  }
  http.get(options, function(res) {
    res.setEncoding('utf8');
    res.on('data', function (chunk) {
      var count = JSON.parse(chunk).count;
      var privateKey = Buffer.from('1b50405666eedd57845c77ff0da8a4fcb6bf4edf4ac70b68bef2181199c4cea8', 'hex')
      var txParams = {
        nonce: '0x'+ Number(count).toString(16),
        gasPrice: 20000000000,
        gasLimit: 60000,
        from: accountAddress,
        to: complierAddress, // complier contract
        data: '0x9dc29fac000000000000000000000000'+ tokenAddress.replace(/^0x/, '') + _.padStart(Number(amount).toString(16), 64, '0'),
        chainId: 42 // kovan
      }
      var tx = new EthereumTx(txParams)
      tx.sign(privateKey)
      var serializedTx = tx.serialize().toString('hex')
      console.log(serializedTx);
    });
  }).on('error', function(e) {
    console.log("Got error: " + e.message);
  });
}
sign('0x1c0cd50ae66352289181865cfa839c2bc8b7e9b3',5,'0xd8215991997bf965ba4da769087a6cfd61c01e16','0x7453C2418d6b3A475A750022cCd01f378d60Fa95');
