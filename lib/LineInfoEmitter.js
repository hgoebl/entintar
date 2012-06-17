/*jshint node:true, es5:true, devel:true, globalstrict:true, regexp:false*/
"use strict";

var EventEmitter = require('events').EventEmitter,
    util = require('util'),
    hexdumpLine = require('./hexdump.js');

/**
 * Replace color codes in str with real curses colors.
 * @returns object with following attributes:
 *   colored: the line with color marker e.g. #{c_cyan}
 *   line: the original line coming from the input stream
 *   emitLevel: the minimal level (1=very import, 9=very verbose)
 */
function analyzeLine(line, rules) {
    var result = {
        line: line
    };
    rules.rules.forEach(function (rule) {
        if (rule.re.test(line)) {
            line = line.replace(rule.re, rule.replace);
            if (rule.emitLevel) {
                if (result.emitLevel) {
                    result.emitLevel = Math.min(result.emitLevel, rule.emitLevel);
                }
                else {
                    result.emitLevel = rule.emitLevel;
                }
            }
        }
    });
    if (!result.emitLevel) {
        result.emitLevel = rules.defaultEmitLevel || 5;
    }
    result.colored = line;
    return result;
}

/**
 * Analyzes stdin and emits <code>lineInfo</code> events.
 *
 * @param options
 * @param rules
 * @constructor
 */
function LineInfoEmitter(options, rules) {
    var stdin = process.stdin,
        incompleteLine,
        self = this;

    EventEmitter.call(this);

    // prepare stdin for character processing and listen to events
    stdin.setEncoding(options.encoding);

    function processData(data) {
        var lastLineIncomplete, lines;

        if (options.debug) {
            console.log('====> incompleteLine:', incompleteLine, 'new chunk:');
            hexdumpLine(data);
        }

        if (incompleteLine) {
            // append data to not yet emitted, incomplete line
            data = incompleteLine + data;
            incompleteLine = null;
        }

        lastLineIncomplete = data && data.charAt(data.length - 1) !== '\n';
        lines = data.split('\n');

        if (lastLineIncomplete) {
            // wait to emit last line until rest of line comes in
            incompleteLine = lines.pop();
        }
        else {
            // remove last '' after newline
            lines.pop();
        }
        lines.forEach(function (line, i) {
            if (options.debug) {
                hexdumpLine(line);
            }
            var lineInfo = analyzeLine(line, rules);
            self.emit('lineInfo', lineInfo);
        });
    }

    stdin.on('data', processData);

    stdin.on('end', function () {
        if (incompleteLine) {
            processData('\n');
        }
        self.emit('end');
    });

    // stdin is paused by default, so let's start!
    stdin.resume();
}

util.inherits(LineInfoEmitter, EventEmitter);

module.exports = LineInfoEmitter;
