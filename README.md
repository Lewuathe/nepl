nepl
====

### what is this?

This is node asyncronous transaction connection module.
You can use this module when you want to connect other server in asynchronous
timing and reliable context. In addition to this, you can use any task with this
module. These task is done by process called by 'Consumer'. Only you have to do is
making consumer. Therefore you have asynchrounous timing and reliable context.

### how to use

Step1. Install via npm

    $ npm install -g nepl

Step2. Create NeplReader

```javascript
    var nepl = require('nepl');
	
	// Define your consumer
	var cons = function(txEntry){
	    for( var i = 0 ; i < txEntry.txs.length ; i++ ){
		    console.log('txString', txEntry.txs[i].txString);
		}
	};

	// Define reader configure
	var config = {
	    name = 'txReader',
		volume = '/from/where/to/somewhere/txvol',
		meta   = '/from/where/to/somewhere/meta',
		consumer : cons
	};

	// Create reader
	var nr = new nepl.NeplReader(config);
```

Step3. Start reader

    $ node reader.js

If any transaction logs are written in /from/where/to/somewhere/txvol, 
this reader read these transactions and passes these to your consumer.
You can access these transaction logs via NeplTX.
NeplTX is an object like below.

    > ntx;
    { context: 
       { timestamp: 1353326701068,
         writer: '/opt/local/lib/node_modules/nepl/NeplTX.js' },
      payload: { p1: 'prop1' } }

This object has two property. Context and payload. Context is meta data, therefore 
you don't have to modify this property. Your data has to be written in payload as 
javascript object. You can use it.

With writeToVol method in this object, you can write data to your transaction volume 
more easily. So the last thing you have to do is to create writer with this NeplTX.

Step 4. Create writer

```javascript 
    var nepl = require('nepl');
	
	var payload = {};
	payload['p1'] = 'prop1';
	payload['p2'] = 'prop2';
	
	var ntx = new nepl.NeplTX();
	tx.setPayload(payload);
	tx.writeToVol('/from/where/to/somewhere/txvol');
```

### Questions

If you have any questions. Please feel free to ask any questions.

- [Blog](http://lewuathe.com)
- [Mail](lewuathe@me.com)
    