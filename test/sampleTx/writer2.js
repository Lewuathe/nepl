var NeplTX = require('../src/NeplTX.js');

var payload = {};
payload['data1'] = 'suneo';
payload['data2'] = 'dorako';

var tx = new NeplTX();
tx.setPayload(payload);
tx.writeToVol(__dirname + '/txvol');