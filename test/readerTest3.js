var nepl = require('../src');

function cons(txEntry){
    for( var i = 0 ; i < txEntry.txs.length ; i++ ){
        console.log('txString3', txEntry.txs[i].txString);
    }
}

var options = {
    name : 'txReader3',
    volume : '/Users/sasakiumi/MyWorks/nepl/test/sampleTX/txvol',
    meta : '/Users/sasakiumi/MyWorks/nepl/test/sampleTX/meta',
    consumer : cons
};

var nr = new nepl.NeplReader(options);
