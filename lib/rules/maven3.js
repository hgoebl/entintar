/*jshint node:true, es5:true, devel:true, globalstrict:true, regexp:false*/
"use strict";

module.exports = {
    colorExtension: {
        error: '#{c_bold_red}',
        info: '#{c_blue}',
        warn: '\u001b[38;5;148m',
        debug: '#{c_blue}',
        success: '#{c_bg_green}#{c_white}',
        failure: '#{c_bg_red}#{c_white}',
        projectname: '#{c_bold_cyan}',
        skipped: '#{c_white}',
        downloading: '#{c_magenta}'
    },
    defaultEmitLevel: 4,
    rules: [
        {   re: /(\[INFO\] Building)( .*)/,
            replace: '#{info}$1#{c_end}#{projectname}$2#{c_end}',
            emitLevel: 2
        },
        {   re: /(Time elapsed: )([0-9]+[.]*[0-9]*.sec)/,
            replace: '#{c_cyan}$1#{c_end}#{c_white}$2#{c_end}',
            emitLevel: 6
        },
        {   re: /(Downloading: .*)/,
            replace: '#{downloading}$1#{c_end}',
            emitLevel: 6
        },
        {   re: /(BUILD FAILURE)/,
            replace: '#{failure}$1#{c_end}',
            emitLevel: 1
        },
        {   re: /(BUILD SUCCESS)/,
            replace: '#{success}$1#{c_end}',
            emitLevel: 1
        },
        {   re: /WARNING: ([a-zA-Z0-9.\-\/$ :]+)/,
            replace: '#{warn}WARNING: $1#{c_end}',
            emitLevel: 4
        },
        {   re: /SEVERE: (.+)/,
            replace: '#{c_white}#{c_bg_red}SEVERE: $1#{c_end}#{c_end}',
            emitLevel: 1
        },
        {   re: /INFO: (.+)/,
            replace: '#{c_white}INFO: $1#{c_end}',
            emitLevel: 5
        },
        {   re: /Caused by: (.+)/,
            replace: '#{c_white}#{c_bg_green}Caused by: $1#{c_end}#{c_end}',
            emitLevel: 4
        },
        {   re: /Running (.+)/,
            replace: '#{c_green}Running $1#{c_end}'
        },
        {   re: /FAILURE (\[[0-9]+.[:0-9]+s\])/,
            replace: '#{error}FAILURE $1#{c_end}',
            emitLevel: 3
        },
        {   re: /SUCCESS (\[[0-9]+.[:0-9]+s\])/,
            replace: '#{success}SUCCESS $1#{c_end}',
            emitLevel: 4
        },
        {   re: /(\[DEBUG.*)/,
            replace: '#{debug}$1#{c_end}',
            emitLevel: 8
        },
        {   re: /(\[INFO.*)/,
            replace: '#{info}$1#{c_end}',
            emitLevel: 5
        },
        {   re: /(\[WARN.*)/,
            replace: '#{warn}$1#{c_end}',
            emitLevel: 4
        },
        {   re: /(\[ERROR.*)/,
            replace: '#{error}$1#{c_end}',
            emitLevel: 2
        },
        {   re: /(<<< FAILURE!)/,
            replace: '#{error}$1#{c_end}',
            emitLevel: 2
        },
        {   re: /Tests run: ([0-9]*), Failures: 0, Errors: 0, Skipped: 0/,
            replace: '#{c_bold_green}Tests run: $1#{c_end}#{info}, 0 Failures/Errors/Skipped#{c_end}',
            emitLevel: 6
        },
        {   re: /Tests run: ([0-9]*), Failures: ([0-9]*), Errors: ([0-9]*), Skipped: ([0-9]*)/,
            replace: '#{c_green}Tests run: $1#{c_end}, Failures: #{warn}$2#{c_end}, Errors: #{error}$3#{c_end}, Skipped: #{skipped}$4#{c_end}',
            emitLevel: 4
        }
    ]
};
