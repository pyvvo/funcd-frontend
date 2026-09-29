import { Command } from 'commander';

import { openApiCommands } from './openapi';

// ############### CONFIG PART START ###############
const program = new Command();

const generate = async () => {
  openApiCommands(program);
};

const bootstrap = async () => {
  try {
    await generate();

    await program.parseAsync();
  } catch (error) {
    const err = <any>error;
    console.log({ err, message: err.message });
  }
};

bootstrap();
