#!/usr/bin/env node

/*
 * HEPlify.js
 * (c) 2019 QXIP BV
 * See LICENSE for details
 */

//'use strict';

const program = require('commander');
const setConfig = require('./src/config').setConfig;
const getConfig = require('./src/config').getConfig;

const pkg = require('./package.json');
const servers = require('./src/servers');
const select = servers.select;

program
  .version(pkg.version)
  .option('-p, --port <number>', 'port to listen on', Number, 9001)
  .option('-a, --address <address>', 'network address to listen on', String, '127.0.0.1')
  .option('-c, --configfile <configfile>', 'configuration file', String)
  .option('-s, --socket <socket>', 'socket service (http,https)', String, 'http')
  .parse(process.argv)

if (!program.socket||!program.configfile) {
  program.help()
} else {
  setConfig(program);
  select(getConfig());
}

