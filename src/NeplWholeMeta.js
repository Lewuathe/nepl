var fs = require('fs');

function NeplWholeMeta(metaObj){
    if( arguments.length === 0 ){
        
    }
    else{
        // initialize meta file
        if( metaObj.volumeName === undefined ){
            throw new Error('NeplWholeMeta: Invalid meta argument');
        }
        
        this.volumeName    = metaObj.volumeName;     // The name of this transaction
        this.lastTimeStamp = new Date().getTime();   // Timestamp of last modified time
        this.lastVol       = 0;                      // Last volume file number
        this.lastVolTxnCnt = 0;                      // Last transaction of target log file
        this.lastVolByteCnt = 0;                     // Last byte offset of target log file
        this.firstUnreadVol = -1;                    // The first volume file that is unread
        this.firstUnreadTxn = -1;                    // The first unread transaction number
        this.oldestVolToKeep = 0;                    // The first number of kept volume file
    }
}

NeplWholeMeta.prototype.stringBuffer = function(){
    var str = '';
    str += '=volumeName=' + this.volumeName + '\n'; 
    str += '=lastVol=' + this.lastVol + '\n';
    str += '=lastVolTxnCnt=' + this.lastVolTxnCnt + '\n';
    str += '=lastVolByteCnt=' + this.lastVolByteCnt + '\n';
    str += '=firstUnreadVol=' + this.firstUnreadVol + '\n';
    str += '=firstUnreadTxn=' + this.firstUnreadTxn + '\n';
    str += '=oldestVolToKeep=' + this.oldestVolToKeep + '\n';
    str += '=end=\n';
    return new Buffer(str);
}


NeplWholeMeta.prototype.parse = function(metaFile){
    fs.readFile(metaFile, function(err, data){
        if(err) throw new Error('NeplMeta: Cannot parse meta file');
        console.log(data.toString());
    });
}





module.exports = NeplWholeMeta;

