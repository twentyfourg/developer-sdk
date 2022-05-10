/* eslint-disable import/no-dynamic-require */
const fs = require('fs');
const path = require('path');
const unique = require('./unique');
const references = require('./references');

module.exports = async (modelPath, modelFiles) => {
  const db = require(path.resolve(process.cwd(), modelPath));
  const insertedData = [];
  const uniqueData = [];

  for (let i = 0; i < modelFiles.length; i++) {
    const modelObj = modelFiles[i];
    const currentModel = require(`${path.resolve(process.cwd(), modelPath)}/${modelObj.model}`);

    const num = modelObj.howMany;
    const dummyData = {};
    let DTO;
    let tableName;
    let dbTable;
    const uniqueObj = {};

    // parse out name of table
    Object.keys(currentModel).forEach((key) => {
      if (key.includes('DTO')) {
        DTO = currentModel[key];
        tableName = key.slice(0, -3);
        dbTable = tableName[0].toUpperCase() + tableName.slice(1, tableName.length);
        dummyData[tableName] = [];
      }
    });

    // populate object with unique values needed
    unique(DTO, uniqueObj, num);
    const uniqueCopy = JSON.parse(
      JSON.stringify(uniqueObj, (key, value) =>
        typeof value === 'bigint' ? value.toString() : value
      )
    );
    uniqueData.push(uniqueCopy);

    // before finding by name or type or anything else - check for a REFERENCES value

    // add however many objects to the dummyData
    const referenceErrors = [];
    for (let j = 0; j < num; j++) {
      // parse out keys and values for inner objects
      const [modelObject, errors] = await references(DTO, uniqueObj);
      if (errors) referenceErrors.push(...errors);
      if (modelObject) {
        dummyData[tableName].push(modelObject);
      }
    }

    // only loop through unique errors and log them out
    [...new Set(referenceErrors)].forEach((error) => console.error(error));

    // insert dummyData directly into correct table
    if (!modelObj.dryRun && dummyData[tableName]) {
      await db[dbTable]
        .bulkCreate(dummyData[tableName], { returning: true, logging: false })
        .then(() => {
          console.log(`${dbTable.toLowerCase()} table populated with ${num} object(s)`);
          console.log(dummyData[tableName][0]);
        })
        .catch((error) => console.error(error.message));
    } else if (modelObj.dryRun) {
      console.log(dummyData);
    }

    // take dummyData and write it to a fixture file
    if (modelObj.createFile) {
      await fs.promises
        .mkdir('./seeders/fixtures', { recursive: true })
        .catch((error) => console.error(error.message));
      await fs.promises
        .writeFile(`./seeders/fixtures/${tableName}.dummy.fixture.json`, JSON.stringify(dummyData))
        .then(() => console.log(`File written: ./seeders/fixtures/${tableName}.dummy.fixture.json`))
        .catch((error) => console.error(error.message));
    }

    insertedData.push(dummyData);
  }
  return { insertedData, uniqueData };
};
