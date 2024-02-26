#!/usr/bin/env node

import chalk from 'chalk';

import Prompt from './Prompt.js';

(async () => {
  try {
    const prompt = new Prompt();
    await prompt.start();
  } catch (error) {
    if (error) console.error(`${chalk.red.bold('✖')} ${chalk.bold(error.message || error)}`);
  }
})();
