/*  NeplTX Class
 *  # This is Nepl transaction class that contains 
 *
 *
 *  @Author Kaisasak
 *  @Date   2012.11.5
 */

function NeplTX(txObj){
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


NeplTX.prototype.toString = function(){
    return this.txString;
}


module.exports = NeplTX;
//module.exports.NeplTX = NeplTX;
