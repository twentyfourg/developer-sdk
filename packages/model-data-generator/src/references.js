const database = require('./util/db.util');
const randomByName = require('./randomByName');
const randomEven = require('./util/randomEven');

const references = async (DTO, uniqueObj) => {
  const modelObj = {};
  const errors = [];

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
        const modelName = modelToQuery.model;

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
          .query(`SELECT ${modelToQuery.key} FROM ${modelName} ORDER BY RAND() LIMIT 1`)
          .then(([results]) => results)
          .catch((error) => {
            errors.push(error.message);
            return [{ [modelToQuery.key]: null }];
          });
        if (Object.keys(DTO[current]) && DTO[current].allowNull) {
          if (randomEven() || !record[modelToQuery.key]) {
            modelObj[current] = null;
          } else {
            modelObj[current] = numberType
              ? Number(record[modelToQuery.key])
              : String(record[modelToQuery.key]);
          }
        } else {
          modelObj[current] = numberType
            ? Number(record[modelToQuery.key])
            : String(record[modelToQuery.key]);
        }
      }
    }
  }
  await randomByName(modelObj, DTO, uniqueObj);
  return [modelObj, errors];
};

module.exports = references;
