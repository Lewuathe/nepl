var net = require('net');
var fs = require('fs');
var path = require('path');
var NeplWholeMeta = require('./NeplWholeMeta');
var NeplTXEntry = require('./NeplTXEntry.js');


var VOLCOUNT_LENGTH = 5;
// Max volume size is 10MB
var MAX_VOL_SIZE = 10000000;

function NeplReader(options){
    var self = this;
    

    var txDir = options.targetVolume;
    this.volume  = txDir + '/vol00001';
    this.meta    = txDir + '/meta';
    this.name    = options.name       ? options.name       : 'nepl_reader';

    if( !options.consumer || typeof options.consumer !== 'function'){
        throw new Error('invalid consumer');
    }
    else{
        this.consumer = options.consumer;
    }

   self.initLogFiles(self, this.volume, this.meta, this.name);
}



NeplReader.prototype.doConsumer = function(curr,prev){
    var self = this;
    var volumeName = self.wholeMeta.volumeName;
    var currentByte = curr.size;
    var previousByte = prev.size;
    var writtenByte = currentByte - previousByte - 1;
    var tx = new Buffer(writtenByte);
    self.wholeMeta.parse(self.meta);
    fs.open(self.volume, 'r', function(err, fd){
        var len = fs.readSync(fd, tx, 0, writtenByte, previousByte);
        var txEntry = new NeplTXEntry();
        txEntry.parse(tx.toString());
        self.consumer(txEntry);
        self.wholeMeta.ownMetas[self.name]['lastVolTxnCnt']++;
        var byteSum = parseInt(self.wholeMeta.ownMetas[self.name]['lastVolByteCnt']) + len;
        self.wholeMeta.ownMetas[self.name]['lastVolByteCnt'] = byteSum + '';
        self.wholeMeta.updateMeta(self.meta);

        // If transaction file is over 1MB, log rotate
        fs.stat(self.volume, function(err, stats){
            if( stats.size > MAX_VOL_SIZE ) {
                NeplReader.logRotate(self.volume);

                var curVol = self.wholeMeta.ownMetas[self.name]['lastVol'];
                self.wholeMeta.ownMetas[self.name]['lastVol'] = parseInt(curVol) + 1 + '';
                self.wholeMeta.ownMetas[self.name]['lastVolTxnCnt'] = '0';
                self.wholeMeta.ownMetas[self.name]['lastVolByteCnt'] = '0';
                fs.unwatchFile(self.volume);
                var dirname = path.dirname(self.volume);
                self.volume = dirname + '/' + NeplReader.incrementVol(path.basename(self.volume));
                self.wholeMeta.updateMeta(self.meta);
                fs.watchFile(self.volume, function(curr, prev){
                    self.doConsumer(curr, prev);
                });
            }
        });

    });
};




/* Initialization of volume file
 *  In this function, only task is make volume file, if there is no ones.
 *  The format of volume file obeyed to NeplTX Class.
 */

NeplReader.initVolume = function(self, volumeFd){
    var initVolume = new Buffer('init volume\n');
    fs.write(volumeFd, initVolume, 0, initVolume.length, 0, function(err, written, buffer){
        if(err) throw new Error('NeplReader: Cannot initialize volume file');
    });
}

/* Initialization of meta file
 *  The format of meta file is below.
 *
 *  VolumeName=volume_name
 *  LastTimeStamp=(new Date().getTime())
 *  ByteOffset=(The offser of last read record)
 *  RecordNum=(The total record count)
 *
 */ 

NeplReader.initMeta = function(self, metaFd, name){
    var wholeMt = self.wholeMeta;
    var metaStr = new Buffer(wholeMt.stringBuffer());
    var metaStrLen = metaStr.length;
    fs.write(metaFd, metaStr, 0, metaStrLen, 0, function(err, written, buffer){
        if(err) throw new Error('NeplReader: Cannot initialize meta file');
        self.wholeMeta.parse(self.meta);
    });
};

NeplReader.logRotate = function(currentVolume){
    var dirname = path.dirname(currentVolume);
    var basename = path.basename(currentVolume);
    var nextBasename = NeplReader.incrementVol(basename);
    fs.open(dirname + '/' + nextBasename, 'w+', function(err, fd){
        if(err) throw new Error('NeplReader: Cannot rotating volume file');
    });
};

NeplReader.incrementVol = function(curVolBasename){
    var volCount = curVolBasename.substring(3).match(/[^0].*/i)[0];
    volCount = parseInt(volCount) + 1 + '';
    for( var i = VOLCOUNT_LENGTH - volCount.length ; i > 0 ; i-- ){
        volCount = '0' + volCount;
    }
    volCount = 'vol' + volCount;
    return volCount;
};


NeplReader.prototype.initLogFiles = function(self, volume, meta, name){
    fs.exists(volume, function(exists){
        if(!exists){
            fs.open(volume, 'w+', function(err, fd){
                if(err) throw new Error('NeplReader: Cannot find available volume file');
            });
        }
        else{
            // If transaction file is over 1MB, log rotate
            fs.stat(volume, function(err, stats){
                if( stats.size > MAX_VOL_SIZE ) {
                    NeplReader.logRotate(volume);
                }
            });
        }
    });

    fs.exists(meta, function(exists){
        var options = {};
        options.volumeName = name;
        options.metaFile = self.meta;
        var wholeMt = new NeplWholeMeta(options);
        self.wholeMeta = wholeMt;
        self.txEntry = new NeplTXEntry(options);
        if(!exists){
            // If there are no meta file, add whole meta data and own meta data.
            fs.open(meta, 'wx', function(err, fd){
                if(err) throw new Error('NeplReader: Cannot find available meta file');
                // Init meta
                NeplReader.initMeta(self, fd, name);
                // Parse meta
                self.wholeMeta.parse(self.meta);
                // In this timing, wholemeta is completed
                fs.watchFile(self.volume, function(curr, prev){
                    self.doConsumer(curr, prev);
                    self.wholeMeta.updateMeta(self.meta);
                });
            });
        }
        else{
            // Only add own meta data
            self.wholeMeta.parse(self.meta);
            if( self.wholeMeta.ownMetas[name] ){
                fs.watchFile(self.volume, function(curr, prev){
                    self.doConsumer(curr, prev);
                });
            }
            else{
                self.wholeMeta.appendOwnMeta(name);
                fs.writeFile(meta, self.wholeMeta.stringBuffer(), function(err){
                    if(err) throw new Error('NeplReader: Cannot write own meta data');
                    self.wholeMeta.parse(self.meta);
                    // In this timing, wholemeta is completed
                    fs.watchFile(self.volume, function(curr, prev){
                        self.doConsumer(curr, prev);
                    });
                });
            }
        }

    });
}


NeplReader.prototype.run = function(){

}


module.exports = NeplReader;

