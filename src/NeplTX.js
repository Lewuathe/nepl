/*  NeplTX Class
 *  # This is Nepl transaction class that contains 
 *
 *
 *  @Author Kaisasak
 *  @Date   2012.11.5
 */

function NeplTX(txObj){
    if( !txObj.context || typeof txObj.context !== 'string' ){
        throw new Error('NeplTX: Invalid context in options');
    }
    else{
        this.context = txObj.context;
    }

    if( !txObj.payload || typeof txObj.payload !== 'string' ){
        throw new Error('NeplTX: Invalid payload in options');
    }
    else{
        this.payload = txObj.payload;
    }

    this.ntxString = JSON.stringify(txObj);
    this.ntxBuffer = new Buffer(this.ntxString);
}


NeplTX.prototype.toString = function(){
    return this.ntxString;
}

module.exports = NeplTX;
//module.exports.NeplTX = NeplTX;
