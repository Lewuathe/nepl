var fs = require('fs');
var crypto = require('crypto');

var oREADER_ID = 0;
var oLAST_VOL  = 1;
var oLAST_VOL_TXN_CNT = 2;
var oLAST_VOL_BYT_CNT = 3;

function NeplOwnMeta(metaObj){
    if( arguments.length === 0 ){
        
    }
    else{
        if( metaObj.volumeName === undefined ){
            throw new Error('NeplOwnMeta: Invalid meta argument');
        }

        /*
        var shasum = crypto.createHash('sha1');
        shasum.update(metaObj.volumeName);
        this.readerId        = shasum.digest('hex');
        */
        this.readerId        = metaObj.volumeName;
        this.lastVol         = 0;
        this.lastVolTxnCnt   = 0;
        this.lastVolByteCnt  = 0;
    }
}

NeplOwnMeta.prototype.stringBuffer = function(){
    var str = '';
    str += 'readerId=' + this.readerId;
    str += ':lastVol=' + this.lastVol;
    str += ':lastVolTxnCnt=' + this.lastVolTxnCnt;
    str += ':lastVolByteCnt=' + this.lastVolByteCnt;
    str += '\n';
    return new Buffer(str);
}


NeplOwnMeta.setParams = function(ownMt, mtData){
    // Step1. Parsing
    var factors = mtData.split(':');
    var readerId = factors[oREADER_ID].split('=')[1];
    var lastVol = factors[oLAST_VOL].split('=')[1];
    // Unread transaction
    var lastVolTxnCnt = factors[oLAST_VOL_TXN_CNT].split('=')[1];
    // Unread bytes
    var lastVolByteCnt = factors[oLAST_VOL_BYT_CNT].split('=')[1];

    // Step2. Creating added meta object
    var addedOwnMt = new NeplOwnMeta({ volumeName : readerId });
    addedOwnMt.lastVol = lastVol;
    addedOwnMt.lastVolTxnCnt = lastVolTxnCnt;
    addedOwnMt.lastVolByteCnt = lastVolByteCnt;
    // Step3. Add
    ownMt[readerId] = addedOwnMt;
}


module.exports = NeplOwnMeta;