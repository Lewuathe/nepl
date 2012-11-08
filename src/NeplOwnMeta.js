var fs = require('fs');
var crypto = require('crypto');

function NeplOwnMeta(metaObj){
    if( arguments.length === 0 ){
        
    }
    else{
        if( metaObj.volumeName === undefined ){
            throw new Error('NeplOwnMeta: Invalid meta argument');
        }

        var shasum = crypto.createHash('sha1');
        shasum.update(metaObj.volumeName);
        this.readerId        = shasum.digest('hex');
        this.lastVol         = 0;
        this.lastVolTxnCnt   = 0;
        this.lastVolByteCnt  = 0;
    }
}

NeplOwnMeta.prototype.stringBuffer = function(){
    var str = '';
    str += 'readerId=' + this.readerId;
    str += ':=lastVol=' + this.lastVol;
    str += ':=lastVolTxnCnt=' + this.lastVolTxnCnt;
    str += ':=lastVolByteCnt=' + this.lastVolByteCnt;
    str += '\n';
    return new Buffer(str);
}

NeplOwnMeta.prototype.parse = function(metaFile){
    var self = this;
    var data = fs.readFileSync(metaFile);
}

NeplOwnMeta.setParams = function(self, mtData){
    
}


module.exports = NeplOwnMeta;