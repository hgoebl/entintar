# About

Instead of showing all lines in the console, the idea behind this appender would be to show only few lines in a
browser window.

One process would be an express server.
The server receives lineinfo requests via dnode and pushes those via socket.io to the browsers.

# Problem

It just doesn't work. Didn't have time to find a solution. BTW it is just a gimmick and nobody needs this ...

# Additional info for package.json

    "dependencies": {
        ...
        "express": "*",
        "socket.io": "*",
        "dnode": "*"
    },
