import { type Command } from 'commander';
import { act } from '../utils';
import * as service from './service';

const openApiCommands = (program: Command) => {
  const openApi = program
    .command('openapi')
    .description('Open api related command');

  openApi
    .command('ts-schema')
    .description('Generate the open api typescript schema')
    .requiredOption(
      '-l, --url <string>',
      'open api schema url',
      'http://localhost:8800/api-docs/openapi.json'
    )
    .requiredOption(
      '-o, --outPath <string>',
      'schema output path',
      'packages/src/core/schema.d.ts'
    )
    .action(async (...args) => await act(service.tsSchema, ...args));

  openApi
    .command('sdk-gen')
    .description('Generate the open api sdk from schema')
    .requiredOption(
      '-p, --confPath <string>',
      'the features file config path',
      'features.json'
    )
    .action(async (...args) => await act(service.sdkGenByDomain, ...args));
};

export default openApiCommands;
