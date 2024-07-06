#!/usr/bin/env node
import yargs from 'yargs/yargs';
import { hideBin } from 'yargs/helpers';
import bumpver from '../lib/index.js';
import bumpverSync from '../lib/sync.js';
import version from '../lib/version.js';

process.stdout.on('error', err => err.code == 'EPIPE' && process.exit(0));

const { value, sync, ...argv } = yargs(hideBin(process.argv))
  .option('sync', {
    alias: 's',
    describe: 'Execute sync variant of bumpver',
    type: 'boolean',
    default: false,
  })
  .options('semVer', {
    alias: 'semver',
    describe: 'Validate version as semver',
    type: 'boolean',
    default: true,
  })
  .options('versionFile', {
    alias: 'f',
    describe: 'File(s) to write version to'
  })
  .coerce('versionFile', value => typeof value === 'string' ? value.split(',').map(v => v.trim()) : value)
  .command('$0 <value>', 'Bump version')
  .version(version)
  .help()
  .parse();

if (sync) {
  bumpverSync(value, argv);
} else {
  await bumpver(value, argv);
}
