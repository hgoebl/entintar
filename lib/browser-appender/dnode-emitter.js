/*jshint node:true, es5:true, devel:true, globalstrict:true, regexp:false*/
"use strict";

var EventEmitter = require('events').EventEmitter,
    util = require('util'),
    dnode = require('dnode'),
    dnodeConnection;

function nop(lineInfo) {
    // nothing
    console.error('[ERROR] not sending line to dnode-server: ', lineInfo); // TODO remove this line
}

function init(dnodeEmitter, options) {
    var self = dnodeEmitter;
    try {
        dnode.connect(5050, function (remote, conn) { // TODO remove magic number 5050
            dnodeConnection = conn;
            dnodeConnection.on('connect', function () {
                self.emitLine = function (lineInfo) {
                    if (lineInfo.emitLevel > 3) { // TODO flexible max-Level
                        return;
                    }
                    remote.emitLine(lineInfo.colored, function () {
                        console.log('emitted line to browser:', lineInfo.line);
                    });
                };
            });
            dnodeConnection.on('end', function () {
                self.emitLine = nop;
            });
        });
    } catch (e) {
        console.error('unable to connect to dnode-server', e);
        self.emitLine = nop;
    }
}

function DnodeEmitter(options) {
    this.emitLine = nop;
    init(this);
}

util.inherits(DnodeEmitter, EventEmitter);

DnodeEmitter.prototype.emitLine = function (lineInfo) {
    this.emitLine(lineInfo);
};

/* TODO close connection on end
if (dnodeConnection) {
    dnodeConnection.end();
}
*/

module.exports = DnodeEmitter;
