/*jshint node:true, es5:true, devel:true, globalstrict:true, regexp:false*/
"use strict";

var fs = require('fs');

function addLogfileAppender(options, rules, lineInfoEmitter) {
    if (!options.logfile) {
        return;
    }

    var status = 'buffering', // 'error', 'ok', 'buffering'
        logstream,
        buffer = [];

    function writeBuffer() {
        if (buffer.length > 0) {
            logstream.write(buffer.join('\n'), options.encoding);
            buffer = [];
        }
    }

    logstream = fs.createWriteStream(options.logfile, { flags: 'w', encoding: options.encoding });
    logstream.on('open', function () {
        if (status === 'error') {
            return;
        }
        // first write buffered lines
        writeBuffer();
        status = 'ok';
    });

    logstream.on('error', function (err) {
        console.log('logstream err', err);
        status = 'error';
    });

    lineInfoEmitter.on('lineInfo', function emitToLogfile(lineInfo) {
        if (lineInfo.emitLevel > 9) {
            return;
        }
        if (status === 'error') {
            return;
        }
        if (!logstream.writable || status === 'buffering') {
            buffer.push(lineInfo.line);
        }
        else {
            writeBuffer();
            logstream.write(lineInfo.line + '\n', options.encoding);
        }
    });

    lineInfoEmitter.on('end', function () {
        if (!logstream.writable) {
            console.log('[ERROR] error writing to logfile!');
        }
        else {
            logstream.on('drain', function () {
                logstream.end();
            });
        }
    });

}

exports.addAppender = addLogfileAppender;
