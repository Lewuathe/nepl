var NeplTX = require('../src/NeplTX.js');

var payload = {};
payload['data1'] = 'takeshi';
payload['data2'] = 'nobita';

var tx = new NeplTX();
tx.setPayload(payload);
tx.writeToVol(__dirname + '/txvol');

/*
payload['data3'] = 'shizuka';
payload['data4'] = 'dekisugi';
tx.setPayload(payload);
tx.writeToVol(__dirname + '/txvol');
*/