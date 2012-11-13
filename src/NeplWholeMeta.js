var fs = require('fs');
var NeplOwnMeta = require('./NeplOwnMeta.js');

var wVOLUME_NAME        = 0;
var wLAST_VOL           = 1;
var wLAST_VOL_TXN_CNT   = 2;
var wLAST_VOL_BYTE_CNT  = 3;
var wFIRST_UNREAD_VOL   = 4;
var wFIRST_UNREAD_TXN   = 5;
var wOLDEST_VOL_TO_KEEP = 6;
var oMETA_START         = 7;

function NeplWholeMeta(metaObj){
    if( arguments.length === 0 ){
        
    }
    else{
        // initialize meta file
        if( metaObj.volumeName === undefined ){
            throw new Error('NeplWholeMeta: Invalid meta argument');
        }

        this.metaFile = metaObj.metaFile;

        this.volumeName    = metaObj.volumeName;     // The name of this transaction
        this.lastTimeStamp = new Date().getTime();   // Timestamp of last modified time
        this.lastVol       = 0;                      // Last volume file number
        this.lastVolTxnCnt = 0;                      // Last transaction of target log file
        this.lastVolByteCnt = 0;                     // Last byte offset of target log file
        this.firstUnreadVol = -1;                    // The first volume file that is unread
        this.firstUnreadTxn = -1;                    // The first unread transaction number
        this.oldestVolToKeep = 0;                    // The first number of kept volume file
        
        this.ownMetas = {};
        this.ownMetas[this.volumeName] = new NeplOwnMeta({ volumeName : this.volumeName });
    }
}

NeplWholeMeta.prototype.stringBuffer = function(){
    var str = '';
    str += 'volumeName=' + this.volumeName + '\n'; 
    str += 'lastVol=' + this.lastVol + '\n';
    str += 'lastVolTxnCnt=' + this.lastVolTxnCnt + '\n';
    str += 'lastVolByteCnt=' + this.lastVolByteCnt + '\n';
    str += 'firstUnreadVol=' + this.firstUnreadVol + '\n';
    str += 'firstUnreadTxn=' + this.firstUnreadTxn + '\n';
    str += 'oldestVolToKeep=' + this.oldestVolToKeep + '\n';
    return new Buffer(str);
}



// Update meta file
NeplWholeMeta.prototype.updateMeta = function(metaFile){
    var self = this;
    var metaStr = new Buffer(this.stringBuffer() + this.ownMetaStringBuffer());
    var metaStrLen = metaStr.length;
    fs.writeFileSync(metaFile, metaStr);
    self.parse(metaFile);
}

// Return own target meta string
NeplWholeMeta.prototype.ownMetaStringBuffer = function(){
    var self = this;
    var str = '';
    for( var ownMt in self.ownMetas ){
        str += self.ownMetas[ownMt].stringBuffer().toString();
    }
    return new Buffer(str);
}

// parsing and create whole meta object
NeplWholeMeta.prototype.parse = function(metaFile){
    var self = this;
    var data = fs.readFileSync(metaFile);
    var wholeMtData = data.toString().split('\n');
    NeplWholeMeta.setParams(self, wholeMtData);
}




NeplWholeMeta.setParams = function(self, mtData){
    var wholeMetaSize = mtData.length;
    self.volumeName       = mtData[wVOLUME_NAME].split('=')[1];
    self.lastVol          = mtData[wLAST_VOL].split('=')[1];
    self.lastVolTxnCnt    = mtData[wLAST_VOL_TXN_CNT].split('=')[1];
    self.lastVolByteCnt   = mtData[wLAST_VOL_BYTE_CNT].split('=')[1];
    self.firstUnreadVol   = mtData[wFIRST_UNREAD_VOL].split('=')[1];
    self.firstUnreadTxn   = mtData[wFIRST_UNREAD_TXN].split('=')[1];
    self.oldestVolToKeep  = mtData[wOLDEST_VOL_TO_KEEP].split('=')[1];
    for( var i = oMETA_START ; i < wholeMetaSize-1 ; i++ ){
        NeplOwnMeta.setParams(self.ownMetas, self.volumeName, mtData[i]);
    }
}
module.exports = NeplWholeMeta;
