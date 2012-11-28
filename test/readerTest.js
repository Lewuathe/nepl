var nepl = require('../src');


function cons(txEntry){
    for( var i = 0 ; i < txEntry.txs.length ; i++ ){
        console.log('txString', txEntry.txs[i].txString);
    }
}

var options = {
    name : 'txReader1',
    targetVolume  : '/Users/sasakiumi/MyWorks/nepl/test/sampleTx',
    consumer : cons
};

var nr = new nepl.NeplReader(options);