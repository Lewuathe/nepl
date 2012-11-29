var nepl = require('../src');

var payload = {};
payload['data1'] = 'takeshi';
payload['data2'] = 'nobita';

var volfile = process.argv[2];
var tx = new nepl.NeplTX();
tx.setPayload(payload);
tx.writeToVol(__dirname + '/sampleTx/' + volfile);
