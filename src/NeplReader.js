var net = require('net');
var fs = require('fs');
var NeplWholeMeta = require('./NeplWholeMeta');

function NeplReader(options){
    var self = this;

    this.volume  = options.volume     ? options.volume     : __dirname + 'txvol';
    this.meta    = options.meta       ? options.meta       : __dirname + 'meta';
    this.name    = options.name       ? options.name       : 'nepl_reader';

    if( !options.consumer || typeof options.consumer !== 'function'){
        throw new Error('invalid consumer');
    }
    else{
        this.consumer = options.consumer;
    }

    NeplReader.initLogFiles(self, this.volume, this.meta, this.name);
        
}




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
    var metaStr = new Buffer(wholeMt.stringBuffer() + wholeMt.ownMetaStringBuffer());
    var metaStrLen = metaStr.length;
    fs.write(metaFd, metaStr, 0, metaStrLen, 0, function(err, written, buffer){
        if(err) throw new Error('NeplReader: Cannot initialize meta file');
        self.wholeMeta.parse(self.meta);
    });
}


NeplReader.initLogFiles = function(self, volume, meta, name){
    fs.exists(volume, function(exists){
        fs.open(volume, 'w+', function(err, fd){
            if(err) throw new Error('NeplReader: Cannot find available volume file');
        });
    });

    fs.exists(meta, function(exists){
        var options = {};
        options.volumeName = name;
        var wholeMt = new NeplWholeMeta(options);
        self.wholeMeta = wholeMt;


        if(!exists){
            // If there are no meta file, add whole meta data and own meta data.
            fs.open(meta, 'w+', function(err, fd){
                if(err) throw new Error('NeplReader: Cannot find available meta file');
                NeplReader.initMeta(self, fd, name);
                self.wholeMeta.parse(self.meta);
                // In this timing, wholemeta is completed
                fs.watchFile(self.volume, function(curr, prev){
                    console.log(prev);
                });
            });
        }
        else{
            // Only add own meta data
            fs.appendFile(meta, self.wholeMeta.ownMetaStringBuffer(), function(err){
                if(err) throw new Error('NeplReader: Cannot write own meta data');
                self.wholeMeta.parse(self.meta);
                // In this timing, wholemeta is completed
                fs.watchFile(self.volume, function(curr, prev){
                    console.log(prev);
                });
            });
        }

    });
}



NeplReader.prototype.run = function(){

}


module.exports = NeplReader;

function cons(data){
    console.log(data);
}

var options = {
    ownport : 8081,
    targetport : 8082,
    ownhost : 'localhost',
    targethost : 'localhost',
    name : 'txReader',
    volume : '/Users/sasakiumi/MyWorks/nepl/sampleTx/txvol',
    meta   : '/Users/sasakiumi/MyWorks/nepl/sampleTx/meta',
    consumer : cons
};

var nr = new NeplReader(options);

//nr.run();
  
