/*   NeplTXEntry Class
 *   # This is sequencial structure that contains NeplTX objects
 *   # This class is used for writing or reading from transaction 
 *   # volume files
 *   @Author Kai Sasaki
 *   @Date   2012.11.5
 */

var fs = require('fs');
var NeplTX = require('./NeplTX.js');

function NeplTXEntry(options){
    this.ntxs = [];
    if( !options.volumeName || typeof options.volumeName !== 'string' ){
        throw new Error('NeplTXEntry: Invalid options');
    }
    else{
        this.volume = options.volume;
    }
}

NeplTXEntry.prototype.addTX = function(ntx){
    var tx = new NeplTX(ntx);
    this.ntxs.push(tx);
}

NeplTXEntry.prototype.writeTXs = function(volume){
    var targetVolume = '';
    if( volume ){
        targetVolume = volume;
    }
    else{
        targetVolume = this.volume;
    }
    var ntxs = this.ntxs;
    for( var i = 0 ; i < ntxs.length ; i++ ){
        fs.appendFile(targetVolume, ntxs[i].toString()+'\n', function(err){
            if(err) throw err;
        });
    }
}

NeplTXEntry.prototype.readTXs = function(volume){
    var targetVolume = '';
    if( volume ){
        targetVolume = volume;
    }
    else{
        targetVolume = this.volume;
    }
}



module.exports = NeplTXEntry;

/*
var options = { volume : __dirname + '/txvol' };

var nEntry = new NeplTXEntry(options);
var tx1 = { context : 'ctx', payload : 'pay' };
var tx2 = { context : 'ctx2', payload : 'pay2' };
nEntry.addTX(tx1);
nEntry.addTX(tx2);
nEntry.writeTXs(__dirname + '/txvol');
*/

