/*jshint node:true, es5:true, devel:true, globalstrict:true, regexp:false*/
"use strict";

var defaultColors;

/*
 http://linuxtidbits.wordpress.com/2008/08/13/output-color-on-bash-scripts-advanced/

 The ANSI sequence: {ESC}[{attr};{bg};{256colors};{fg}m

 {ESC} or \033 represents the ANSI escape-sequence.
 {attr} represents the outputs attributes (properties such as blinking and bold text),
 {fg} is the foreground color,
 {bg} is the background color,
 m means the sequence ends.
 */

defaultColors = {
    c_black: '\u001b[30m',
    c_red: '\u001b[31m',
    c_green: '\u001b[32m',
    c_yellow: '\u001b[33m',
    c_blue: '\u001b[34m',
    c_magenta: '\u001b[35m',
    c_cyan: '\u001b[36m',
    c_white: '\u001b[37m',
    c_bg_black: '\u001b[40m',
    c_bg_red: '\u001b[41m',
    c_bg_green: '\u001b[42m',
    c_bg_yellow: '\u001b[43m',
    c_bg_blue: '\u001b[44m',
    c_bg_magenta: '\u001b[45m',
    c_bg_cyan: '\u001b[46m',
    c_bg_white: '\u001b[47m',
    c_bold_black: '\u001b[1;30m',
    c_bold_red: '\u001b[1;31m',
    c_bold_green: '\u001b[1;32m',
    c_bold_yellow: '\u001b[1;33m',
    c_bold_blue: '\u001b[1;34m',
    c_bold_magenta: '\u001b[1;35m',
    c_bold_cyan: '\u001b[1;36m',
    c_bold_white: '\u001b[1;37m',
    c_bold: '\u001b[1m',
    c_end: '\u001b[0m',
    error: '#{c_bold_red}',
    warn: '#{c_yellow}',
    info: '#{c_blue}'
};

function replaceColors(str, colors) {
    var re = /#\{([a-z_]+)\}/g;

    return str.replace(re, function (str, p1) {
        return colors[p1] || '!!!' + p1 + '!!!';
    });
}

// prepare color table (resolve logical color names)
function prepareColors(colors) {
    Object.keys(colors).forEach(function (color) {
        var code = colors[color],
            replaced = replaceColors(code, colors);

        if (replaced !== code) {
            colors[color] = replaced;
        }
    });
}

function copyColors(src, dest) {
    Object.keys(src).forEach(function (color) {
        dest[color] = src[color];
    });
}

// -----===== public =====------

function ShellColors(options, colorExtension) {
    this.colors = {};
    this.debug = options.debug;

    copyColors(defaultColors, this.colors);

    if (colorExtension) {
        copyColors(colorExtension, this.colors);
    }
    prepareColors(this.colors);

    if (this.debug) {
        console.log(this.colors);
    }
}

ShellColors.prototype.replaceColors = function (str) {
    return this.debug ? str : replaceColors(str, this.colors);
};

module.exports = ShellColors;
