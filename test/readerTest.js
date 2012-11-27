var nepl = require('../src');


function cons(txEntry){
    for( var i = 0 ; i < txEntry.txs.length ; i++ ){
        console.log('txString', txEntry.txs[i].txString);
    }
}

var options = {
    name : 'txReader1',
    volume : '/Users/sasakiumi/MyWorks/nepl/test/sampleTx/txvol',
    meta   : '/Users/sasakiumi/MyWorks/nepl/test/sampleTx/meta',
    consumer : cons
};

var nr = new nepl.NeplReader(options);