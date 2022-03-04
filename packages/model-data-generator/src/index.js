#!/usr/bin/env node

require('dotenv').config();
require('@twentyfourg/cloud-sdk').logger();
const { StringPrompt, MultiSelect, NumberPrompt, Toggle } = require('enquirer');
const fs = require('fs');
const database = require('./util/db.util');
const generate = require('./generate');

module.exports.run = async () => {
  const params = [];

  const modelPath = await new StringPrompt({
    initial: process.env.SDK_SEQUELIZE_MODELS_PATH || './src/db/models',
    message: 'Please confirm the path to the models folder:',
  }).run();

  if (!fs.existsSync(modelPath) || !fs.statSync(modelPath).isDirectory()) {
    if (!fs.existsSync(modelPath)) console.log(`${modelPath} is not a valid path`);
    else if (!fs.statSync(modelPath).isDirectory()) console.log(`${modelPath} is not a directory`);
    process.exit();
  }

  const files = fs.readdirSync(modelPath).filter((name) => name.includes('.model.js'));
  if (!files.length) {
    console.log(`No .model.js files found in ${modelPath}`);
    process.exit();
  }

  const models = await new MultiSelect({
    message: 'What model(s) would you like to populate?',
    choices: files,
  }).run();

  for (let i = 0; i < models.length; i++) {
    const howMany = await new NumberPrompt({
      name: 'howMany',
      message: `How many objects do you want to create for ${models[i]}?`,
      initial: 1,
    }).run();
    const dryRun = await new Toggle({
      message: `Run ${models[i]} as a dry run?`,
      enabled: 'Yes',
      disabled: 'No',
      initial: 'Yes',
    }).run();
    const createFile = await new Toggle({
      message: `Create a fixture file for ${models[i]}?`,
      enabled: 'Yes',
      disabled: 'No',
    }).run();
    params.push({
      model: models[i],
      howMany: typeof howMany === 'number' && howMany > 0 ? howMany : null,
      dryRun: typeof dryRun === 'boolean' ? dryRun : null,
      createFile: typeof createFile === 'boolean' ? createFile : null,
    });
  }

  // Only runs generate if all parameters are provided

  let populated = true;
  params.forEach((mod) => {
    if (Object.values(mod).includes('') || Object.values(mod).includes(null)) {
      populated = false;
    }
  });
  if (populated) {
    await generate(modelPath, params);
    await database.end();
  } else {
    console.log('Failed to provide all parameters');
  }
};

this.run()
  .then(() => process.exit())
  .catch((error) => {
    if (error) console.error(error);
  });
