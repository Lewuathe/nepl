var fs = require('fs');

function NeplMeta(metaObj){
    if( arguments.length === 0 ){
        
    }
    else{
        // initialize meta file
        if( metaObj.volumeName === undefined ){
            throw new Error('NeplMeta: Invalid meta argument');
        }
        
        this.volumeName    = metaObj.volumeName;     // The name of this transaction
        this.lastTimeStamp = new Date().getTime();   // Timestamp of last modified time
        this.lastVol       = 0;                      // Last volume file number
        this.lastVolTxnCnt = 0;                      // Last transaction of target log file
        this.lastVolByteCnt = 0;                     // Last byte offset of target log file
    }
}

NeplMeta.prototype.stringBuffer = function(){
    var str = '';
    str += '=volumeName=' + this.volumeName + '\n'; 
    str += '=lastVol=' + this.lastVol + '\n';
    str += '=lastVolTxnCnt=' + this.lastVolTxnCnt + '\n';
    str += '=lastVolByteCnt=' + this.lastVolByteCnt + '\n';
    str += '=lastTimeStamp=' + this.lastTimeStamp + '\n';
    str += '=byteOffset=' + this.byteOffset + '\n';
    str += '=recordNum=' + this.recordNum + '\n';
    str += '=end=\n';
    return new Buffer(str);
}


NeplMeta.prototype.parse = function(metaFile){
    fs.readFile(metaFile, function(err, data){
        if(err) throw new Error('NeplMeta: Can\'t parse meta file');
        console.log(data.toString());
    });
}






module.exports = NeplMeta;

