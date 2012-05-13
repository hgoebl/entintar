/*jshint node:true, es5:true, devel:true, globalstrict:true, regexp:false, indent:4*/
"use strict";

var stdin = process.stdin,
    stdout = process.stdout,
    optimist = require('optimist'),
    options,
    rules,
    fs = require('fs'),
    incompleteLine,
    logstream,
    logstreamBuf,
    ShellColors = require('./lib/shell-colors.js'),
    shellColors;

// parse command line arguments and options
options = optimist
    .usage('Usage: $0 [options]')
    .demand(0)
    .options('encoding', {
        'default': 'utf8',
        alias: 'e',
        describe: 'character-set of stdin input'
    })
    .options('logfile', {
        'default': null,
        describe: 'path/name of file where stdin is written to'
    })
    .options('color', {
        'default': true,
        describe: 'colorize output (--no-color to disable)'
    })
    .options('rules', {
        'default': 'maven3',
        describe: 'name of rule-set or path to rules.js'
    })
    .options('debug', {
        'default': false,
        describe: 'output for easier debugging'
    })
    .options('help', {
        alias: 'h',
        describe: 'show help and exit'
    })
    .argv;


// fast exit when demanding help ...
if (options.help) {
    optimist.showHelp();
    process.exit(1);
}

// detect the rule set for coloring and filtering
if (options.rules.match(/^\w+$/)) {
    rules = require('./lib/rules/' + options.rules + '.js');
}
else {
    rules = require(options.rules);
}

// add additional color names and values to options object
options.colorExtension = rules.colorExtension;
shellColors = new ShellColors(options);

if (options.debug) {
    console.log(options);
}

if (options.logfile) {
    logstream = fs.createWriteStream(options.logfile, { flags: 'w', encoding: options.encoding });
    logstream.on('open', function () {
        // console.log('logstream opened; logstreamBuf =', logstreamBuf);
        if (logstreamBuf) {
            logstream.write(logstreamBuf, options.encoding);
            logstreamBuf = null;
        }
    });
    logstream.on('error', function (err) {
        console.log('logstream err', err);
    });
}

/**
 * Replace color codes in str with real curses colors.
 * @returns object with following attributes:
 *   colored: the line with color marker e.g. #{c_cyan}
 *   line: the original line coming from the input stream
 *   emitLevel: the minimal level (1=very import, 9=very verbose)
 */
function analyzeLine(line) {
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


/* TODO add some structure to this spaguetti code
 var EventEmitter = require('events').EventEmitter,
 util = require('util'),
 // create the class
 var LineInfoEmitter = function () {
 };
 LineInfoEmitter.prototype.process = function () {
 };
 // augment the prototype using util.inherits
 util.inherits(LineInfoEmitter, EventEmitter);
 */

function emitToStdout(lineInfo) {
    if (lineInfo.emitLevel > 7) { // TODO flexible max-Level
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
}

function emitToLogfile(lineInfo) {
    if (lineInfo.emitLevel > 9) { // TODO flexible max-Level
        return;
    }
    if (logstream) {
        if (!logstream.writable) {
            console.log('[ERROR] could not append to log: ' + lineInfo.line);
        }
        else {
            logstream.write(lineInfo.line + '\n', options.encoding);
        }
    }
}

function hexdumpLine(str) {
    var i, len, code, hex, buf, line, pline, pos = 0;
    while ((line = str.slice(pos, pos + 16))) {
        buf = [];
        pline = '';
        for (i = 0, len = line.length; i < len; ++i) {
            code = line.charCodeAt(i);
            hex = code.toString(16);
            hex = hex.length === 1 ? '0' + hex : hex;
            buf.push(hex);
            pline += (code >= 0x20 && code < 0x7F) ? line.charAt(i) : '.';
        }
        while (i++ < 16) {
            buf.push('  ');
        }
        console.log(buf.join(' ') + '|' + pline);
        pos += 16;
    }
}


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
        var lineInfo = analyzeLine(line);
        emitToStdout(lineInfo);
        emitToLogfile(lineInfo);
    });
}

stdin.on('data', processData);
stdin.on('end', function () {
    if (incompleteLine) {
        processData('\n');
    }
    if (logstream) {
        if (!logstream.writable) {
            console.log('[ERROR] error writing to logfile!');
        }
        else {
            logstream.on('drain', function () {
                logstream.end();
            });
        }
    }
    // process.exit(0);
});

// stdin is paused by default, so let's start!
stdin.resume();
