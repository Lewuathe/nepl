var nepl = require('../src');

var payload = {};
payload['data1'] = 'takeshi';
payload['data2'] = 'nobita';

var tx = new nepl.NeplTX();
tx.setPayload(payload);
tx.writeToVol(__dirname + '/sampleTx/vol00001');
