/*  NeplTX Class
 *  # This is Nepl transaction class that contains 
 *
 *
 *  @Author Kaisasak
 *  @Date   2012.11.5
 */


var path = require('path');
var fs = require('fs');
var NeplWholeMeta = require('./NeplWholeMeta.js');

function NeplTX(txObj){
    if( arguments.length === 0 ){
        this.context = {};
        this.context['timestamp'] = NeplTX.getDate();
        this.context['writer'] = __filename;
    }
    else{
        if( !txObj.context || typeof txObj.context !== 'object' ){
            throw new Error('NeplTX: Invalid context in options');
        }
        else{
            this.context = txObj.context;
        }
        
        if( !txObj.payload || typeof txObj.payload !== 'object' ){
            throw new Error('NeplTX: Invalid payload in options');
        }
        else{
            this.payload = txObj.payload;
        }
        
        this.txString = JSON.stringify(txObj);
        this.txBuffer = new Buffer(this.txString);
    }
}

NeplTX.getDate = function(){
    var d = new Date();
    return d.getTime();
}

NeplTX.prototype.setPayload = function(payloadObj){
    var self = this;
    self.payload = payloadObj;
}

NeplTX.prototype.toString = function(){
    var self = this;
    return JSON.stringify(self) + '\n';
}


NeplTX.prototype.writeToVol = function(volumefile){
    var self = this;
    var metafile = path.dirname(volumefile) + '/meta';
    var wholeMeta = new NeplWholeMeta();
    wholeMeta.parse(metafile);
    wholeMeta.lastVol = parseInt(wholeMeta.lastVol) + 1;
    wholeMeta.lastVolTxnCnt = parseInt(wholeMeta.lastVolTxnCnt) + 1;
    wholeMeta.lastVolByteCnt = parseInt(wholeMeta.lastVolByteCnt) + self.toString().length;
    fs.appendFileSync(volumefile, self.toString());
}


module.exports = NeplTX;
//module.exports.NeplTX = NeplTX;
