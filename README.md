# bookshelf-engine

An engine for telling people about your bookshelf

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/bookshelf-engine.svg)](https://npmjs.org/package/bookshelf-engine)
[![CircleCI](https://circleci.com/gh/chpwssn/bookshelf-engine/tree/master.svg?style=shield)](https://circleci.com/gh/chpwssn/bookshelf-engine/tree/master)
[![Downloads/week](https://img.shields.io/npm/dw/bookshelf-engine.svg)](https://npmjs.org/package/bookshelf-engine)
[![License](https://img.shields.io/npm/l/bookshelf-engine.svg)](https://github.com/chpwssn/bookshelf-engine/blob/master/package.json)

# Quickstart

1. Register for an [ISBNdb account](https://isbndb.com)
2. Set your API key as an environment variable `export ISBNDB_API_KEY=yourkey`
3. Set the path to your on-disk cache (saves ISBNdb API requests) `export BOOKSHELF_CACHE_DIR=/path/to/cache/dir`

<!-- toc -->

- [Usage](#usage)
- [Commands](#commands)
  <!-- tocstop -->

# Usage

<!-- usage -->

```sh-session
$ npm install -g bookshelf-engine
$ bookshelf COMMAND
running command...
$ bookshelf (-v|--version|version)
bookshelf-engine/0.0.0 darwin-x64 node-v8.12.0
$ bookshelf --help [COMMAND]
USAGE
  $ bookshelf COMMAND
...
```

<!-- usagestop -->

# Commands

<!-- commands -->

- [`bookshelf hello [FILE]`](#bookshelf-hello-file)
- [`bookshelf help [COMMAND]`](#bookshelf-help-command)

## `bookshelf hello [FILE]`

describe the command here

```
USAGE
  $ bookshelf hello [FILE]

OPTIONS
  -f, --force
  -h, --help       show CLI help
  -n, --name=name  name to print

EXAMPLE
  $ bookshelf hello
  hello world from ./src/hello.ts!
```

_See code: [src/commands/hello.ts](https://github.com/chpwssn/bookshelf-engine/blob/v0.0.0/src/commands/hello.ts)_

## `bookshelf help [COMMAND]`

display help for bookshelf

```
USAGE
  $ bookshelf help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v2.2.1/src/commands/help.ts)_

<!-- commandsstop -->
