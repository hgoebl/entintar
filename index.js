/*jshint node:true, es5:true, devel:true, globalstrict:true, regexp:false, indent:4*/
"use strict";

var LineInfoEmitter = require('./lib/LineInfoEmitter.js'),
    lineInfoEmitter,
    optimist = require('optimist'),
    options,
    rules;

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

if (options.debug) {
    console.log(options);
}

// detect the rule set for coloring and filtering
if (options.rules.match(/^\w+$/)) {
    rules = require('./lib/rules/' + options.rules + '.js');
}
else {
    rules = require(options.rules);
}

lineInfoEmitter = new LineInfoEmitter(options, rules);

require('./lib/stdout-appender.js').addAppender(options, rules, lineInfoEmitter);
require('./lib/logfile-appender.js').addAppender(options, rules, lineInfoEmitter);
