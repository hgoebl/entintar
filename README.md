# entintar

This is a small tool to colorize and filter the verbose output of Maven or other unreadable text output.

## The name?

'entintar' is Spanish and AKFAIK means something like ink or colorize. Colorizer was already used.

## Usage

```
Usage: node ./bin/entintar [options]

Options:
  --encoding, -e  character-set of stdin input                 [default: "utf8"]
  --logfile       path/name of file where stdin is written to  [default: null]
  --color         colorize output (--no-color to disable)      [default: true]
  --rules         name of rule-set or path to rules.js         [default: "maven3"]
  --debug         output for easier debugging                  [default: false]
  --help, -h      show help and exit
```
## Installation

In most cases it makes only sense to install entintar globally:

    npm install entintar -g

## Example Output

![example output](https://github.com/hgoebl/entintar/blob/master/maven-colored.png?raw=true)

## Use with maven

You could use entintar by placing the filter after each call to `mvn`. Example:

    mvn clean install -Pgf-redeploy | entintar

Of course this is cumbersome. You better find a way to alias your mvn command and let your shell append the call
to the filter.

### Linux

Place following lines in your ~/.bashrc:

```bash
mvn_colored() {
    $MAVEN_HOME/bin/mvn $* | entintar
    # $MAVEN_HOME/bin/mvn $* | entintar --logfile mvn.log
}
alias mvn=mvn_colored
```

If you want to run the maven command w/out coloring, then run

    "mvn" ...

This will ignore the bash alias and directly run the mvn command.

### Darwin

**TODO** I don't have a Mac. @Apple, can you sponsor a MacBook to me, please? (Still waiting for an answer...)

### Cygwin

**TODO** My Windows7 node installation (0.6.18) doesn't work in Cygwin. Probably some cygpath calls could solve the problem.

### Windows

Out-of-the-box Windows lacks the support for `alias` like in bash.
You have to fiddle around with DOSKEY, PowerShell and the like. Please tell me if you found a solution!

Some probably helpful Links:

  * <http://superuser.com/questions/150244/command-aliases-in-dos>
  * <http://www.uberullu.com/alias-in-windows-command-line-ms-dos-how-to/>

## Extend

You can easily extend this tool by providing a rules.js (see lib/rules/maven3.js for an example).
If placed in the same directory, you can select the rules with the command line option --rules and the name
w/out '.js'.
It is also possible to place a rules file elsewhere and provide the full path to this file.

## TODO

  * Write a real test (not just invoke the program)

## License

MIT (see LICENSE file)

## See also

Similar Tools:
  * <http://linux.die.net/man/1/ccze>

Converting ANSI Colors to HTML:
  * <http://www.pixelbeat.org/scripts/ansi2html.sh>
  * <http://ziz.delphigl.com/tool_aha.php>
