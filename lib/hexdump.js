/*jshint node:true, es5:true, devel:true, globalstrict:true, regexp:false, indent:4*/
"use strict";

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

exports.hexdumpLine = hexdumpLine;
