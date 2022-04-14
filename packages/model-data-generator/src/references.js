const { StringPrompt } = require('enquirer');
const database = require('./util/db.util');
const randomByName = require('./randomByName');
const randomEven = require('./util/randomEven');

const refFields = {};

const references = async (DTO, uniqueObj) => {
  const modelObj = {};
  const errors = [];
  let modelKey;

  for (let i = 0; i < Object.keys(DTO).length; i++) {
    const current = Object.keys(DTO)[i];
    let modelToQuery = '';

    if (
      !Object.keys(DTO[current]).includes('defaultValue') &&
      !Object.keys(DTO[current]).includes('primaryKey')
    ) {
      if (
        Object.keys(DTO[current]).includes('references') &&
        (process.env.READER_SQL_HOST || process.env.SQL_HOST)
      ) {
        const recordType = DTO[current].type.constructor.name;
        let numberType = false;
        modelToQuery = DTO[current].references;

        if (!refFields[`${current}`]) {
          refFields[`${current}`] = '';
        }

        // all the ways a reference can be defined in Sequelize https://sequelize.org/api/v6/class/src/model.js~model#static-method-init
        let modelName;
        if (typeof modelToQuery === 'string') {
          // references: string
          modelName = modelToQuery;
          if (!refFields[`${current}`]) {
            modelKey = await new StringPrompt({
              initial: 'id',
              message: `What key in '${modelName}' model should be referenced in '${current}' column?`,
            }).run();

            refFields[`${current}`] = modelKey;
          } else {
            modelKey = refFields[`${current}`];
          }
        } else if (modelToQuery.model && typeof modelToQuery.model === 'string') {
          // references: { model: string }
          modelName = modelToQuery.model;
          modelKey = modelToQuery.key;
        } else if (modelToQuery.model && typeof modelToQuery.model === 'object') {
          // references: { model: { tableName: string } }
          // <T extends Sequelize.Model> ends up here too
          modelName = modelToQuery.model.tableName;
          modelKey = modelToQuery.key;
        } else {
          errors.push(
            `Model with fields ${Object.keys(
              DTO
            )} contains a malformed model reference under key ${current}`
          );
          break;
        }

        switch (recordType) {
          case 'INTEGER':
          case 'BIGINT':
          case 'MEDIUMINT':
          case 'SMALLINT':
          case 'TINYINT':
          case 'BOOLEAN':
          case 'FLOAT':
          case 'DOUBLE PRECISION':
          case 'DECIMAL':
          case 'REAL':
            numberType = true;
            break;
          default:
            break;
        }
        const db = await database.getPool();
        const [record] = await db
          .query(`SELECT ${modelKey} FROM \`${modelName}\` ORDER BY RAND() LIMIT 1`)
          .then(([results]) => results)
          .catch((error) => {
            errors.push(error.message);
            return [{ [modelToQuery.modelKey]: null }];
          });
        if (Object.keys(DTO[current]) && DTO[current].allowNull) {
          if (randomEven() || !record[modelKey]) {
            modelObj[current] = null;
          } else {
            modelObj[current] = numberType ? Number(record[modelKey]) : String(record[modelKey]);
          }
        } else {
          modelObj[current] = numberType ? Number(record[modelKey]) : String(record[modelKey]);
        }
      }
    }
  }
  await randomByName(modelObj, DTO, uniqueObj);
  return [modelObj, errors];
};

module.exports = references;
