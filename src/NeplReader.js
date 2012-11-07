var net = require('net');
var fs = require('fs');
var NeplMeta = require('./NeplMeta');

function NeplReader(options){
    /* Initialization of volume file
     *  In this function, only task is make volume file, if there is no ones.
     *  The format of volume file obeyed to NeplTX Class.
     */

    function initVolume(volumeFd){
        var initVolume = new Buffer('init volume\n');
        fs.write(volumeFd, initVolume, 0, initVolume.length, 0, function(err, written, buffer){
            if(err) throw new Error('NeplReader: Can\'t initialize volume file');
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
     *  === example ===
     *
     *  VolumeName=myvolume
     *  LastTimeStamp=1352176628158
     *  ByteOffset=123341
     *  RecordNum=12
     *
     */ 

    function initMeta(metaFd, name){
        var options = {};
        options.volumeName = name;
        var meta = new NeplMeta(options);
        fs.write(metaFd, meta.stringBuffer(), 0, meta.stringBuffer().length,
                 0, function(err, written, buffer){
                     if(err) throw new Error('NeplReader: Can\'t initialize meta file');
        });
    }
    function initLogFiles(volume, meta, name){
        fs.exists(volume, function(exists){
            fs.open(volume, 'w+', function(err, fd){
                if(err) throw new Error('NeplReader: Can\'t find available volume file');
            });
        });
        fs.exists(meta, function(exists){
            if(!exists){
                fs.open(meta, 'w+', function(err, fd){
                    if(err) throw new Error('NeplReader: Can\'t find available meta file');
                    initMeta(fd, name);
                });
            }
        });
    }

    this.volume  = options.volume     ? options.volume     : __dirname + 'txvol';
    this.meta    = options.meta       ? options.meta       : __dirname + 'meta';
    this.port    = options.ownport    ? options.ownport    : 8081;
    this.host    = options.ownhost    ? options.ownhost    : 'localhost';
    this.name    = options.name       ? options.name       : 'nepl_reader';

    if( !options.consumer || typeof options.consumer !== 'function'){
        throw new Error('invalid consumer');
    }
    else{
        this.consumer = options.consumer;
    }
    initLogFiles(this.volume, this.meta, this.name);
        
}


NeplReader.prototype.run = function(){
    var meta = new NeplMeta();
    var volume = this.volume;
    var metaFile = this.meta;
    process.nextTick(function(){
        meta.parse(metaFile);
        fs.watchFile(volume, function(curr, prev){
            consumer(curr);
        });
    });
}







    
function cons(data){
    console.log(data);
}

var options = {
    ownport : 8081,
    targetport : 8082,
    ownhost : 'localhost',
    targethost : 'localhost',
    name : 'txReader',
    volume : __dirname + '/txvol',
    meta   : __dirname + '/meta',
    consumer : cons
};

var nr = new NeplReader(options);

nr.run();
    
