/*jshint node:true, globalstrict:true, es5:true, devel:true*/
'use strict';

var express = require('express'),
    app = express.createServer(),
    io = require('socket.io').listen(app),
    dnode = require('dnode'),
    dnodeServer;

// Configuration
app.configure('all', function () {
    app.use(express.bodyParser());
    app.use(express.cookieParser());
    app.use(express.session({ secret: 'T7is6@:!Hoa=OzapftIs' }));
    app.use(app.router);
    app.use(express['static'](__dirname + '/htdocs'));
});

app.configure('development', function () {
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function () {
    app.use(express.errorHandler());
});

app.listen(8008);

console.log('Express server listening on port %d in %s mode',
    app.address().port, app.settings.env);

io.set('transports', ['websocket', 'htmlfile', 'xhr-polling', 'jsonp-polling']);
io.set('log level', 2); // TODO 2

io.sockets.on('connection', function (socket) {
    console.log('Socket connected! id:', socket.id);
    /* Test
    socket.on('jump', function (data) {
        console.log('on-message', data);
        socket.broadcast.emit('jump', data);
    });
    socket.on('disconnect', function () {
        console.log('Socket with id %s disconnected.', socket.id);
    });
    */
    setInterval(function () {
        socket.emit('line', 'Ding dong die hex is tot!');
    }, 2000);
});

dnodeServer = dnode({
    emitLine: function (line, callback) {
        io.sockets.broadcast.emit('line', line);
        // callback()
    }
});
dnodeServer.listen(5050);

app.sockets = io.sockets; // expose sockets to caller

module.exports = {
};