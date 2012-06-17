/*jshint node:true, es5:true, devel:true, globalstrict:true, regexp:false*/
"use strict";

var ShellColors = require('./shell-colors.js');

function addStdoutAppender(options, rules, lineInfoEmitter) {
    var stdout = process.stdout,
        shellColors;

    // add additional color names and values to options object
    shellColors = new ShellColors(options, rules.colorExtension);

    lineInfoEmitter.on('lineInfo', function emitToStdout(lineInfo) {
        if (lineInfo.emitLevel > 7) {
            return;
        }
        if (options.color) {
            var coloredLine = lineInfo.colored;
            coloredLine = shellColors.replaceColors(coloredLine);
            stdout.write(coloredLine + '\n');
        }
        else {
            stdout.write(lineInfo.line + '\n');
        }
    });
}

exports.addAppender = addStdoutAppender;
