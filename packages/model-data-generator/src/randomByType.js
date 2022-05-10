/* eslint-disable no-prototype-builtins */
/* eslint-disable no-bitwise */
const { faker } = require('@faker-js/faker');

const randomEven = require('./util/randomEven');

// if any value is blank, attempt to create a value based on type
const randomByType = (modelObj, DTO) => {
  for (let i = 0; i < Object.entries(modelObj).length; i++) {
    const key = Object.entries(modelObj)[i][0];
    const value = Object.entries(modelObj)[i][1];

    if (value === null) {
      const dataType = DTO[key].type.key.toLowerCase();

      switch (dataType) {
        case 'string':
        case 'char':
          if (DTO[key].hasOwnProperty('allowNull') && DTO[key].allowNull) {
            if (randomEven()) {
              if (Object.keys(DTO[`${key}`]).includes('length')) {
                modelObj[key] = faker.datatype.string(DTO[`${key}`].length);
              } else {
                modelObj[key] = faker.datatype.string();
              }
            } else {
              modelObj[key] = null;
            }
          } else if (
            !DTO[key].hasOwnProperty('allowNull') &&
            Object.keys(DTO[`${key}`]).includes('length')
          ) {
            modelObj[key] = faker.datatype.string(DTO[`${key}`].length);
          } else {
            modelObj[key] = faker.datatype.string();
          }
          break;
        case 'text':
          if (DTO[key].hasOwnProperty('allowNull') && DTO[key].allowNull) {
            if (randomEven()) {
              if (Object.keys(DTO[`${key}`]).includes('length')) {
                if (DTO[`${key}`].length.toLowerCase() === 'tiny') {
                  modelObj[key] = faker.lorem.sentences(2);
                } else if (DTO[`${key}`].length.toLowerCase() === 'medium') {
                  modelObj[key] = faker.lorem.sentences(8);
                } else if (DTO[`${key}`].length.toLowerCase() === 'long') {
                  modelObj[key] = faker.lorem.sentences(16);
                } else {
                  console.log(`Could not parse length constraint for ${key}`);
                }
              } else {
                modelObj[key] = faker.lorem.sentences(3);
              }
            } else {
              modelObj[key] = null;
            }
          } else if (
            !DTO[key].hasOwnProperty('allowNull') &&
            Object.keys(DTO[`${key}`]).includes('length')
          ) {
            if (DTO[`${key}`].length.toLowerCase() === 'tiny') {
              modelObj[key] = faker.lorem.sentences(2);
            } else if (DTO[`${key}`].length.toLowerCase() === 'medium') {
              modelObj[key] = faker.lorem.sentences(8);
            } else if (DTO[`${key}`].length.toLowerCase() === 'long') {
              modelObj[key] = faker.lorem.sentences(16);
            } else {
              console.log(`Could not parse length constraint for ${key}`);
            }
          } else {
            modelObj[key] = faker.lorem.sentences(3);
          }
          break;
        case 'boolean':
          if (DTO[key].hasOwnProperty('allowNull') && DTO[key].allowNull) {
            if (randomEven()) {
              modelObj[key] = randomEven() ? 0 : 1;
            } else {
              modelObj[key] = null;
            }
          } else {
            modelObj[key] = randomEven() ? 0 : 1;
          }
          break;
        case 'integer':
          if (DTO[key].hasOwnProperty('allowNull') && DTO[key].allowNull) {
            if (randomEven()) {
              modelObj[key] = faker.datatype.number({ min: -2147483648, max: 2147483647 });
            } else {
              modelObj[key] = null;
            }
          } else {
            modelObj[key] = faker.datatype.number({ min: -2147483648, max: 2147483647 });
          }
          break;
        case 'bigint':
          if (DTO[key].hasOwnProperty('allowNull') && DTO[key].allowNull) {
            if (randomEven()) {
              modelObj[key] = faker.datatype.bigInt();
            } else {
              modelObj[key] = null;
            }
          } else {
            modelObj[key] = faker.datatype.bigInt();
          }
          break;
        case 'mediumint':
          if (DTO[key].hasOwnProperty('allowNull') && DTO[key].allowNull) {
            if (randomEven()) {
              modelObj[key] = faker.datatype.number({ min: -8388608, max: 8388608 });
            } else {
              modelObj[key] = null;
            }
          } else {
            modelObj[key] = faker.datatype.number({ min: -8388608, max: 8388608 });
          }
          break;
        case 'smallint':
          if (DTO[key].hasOwnProperty('allowNull') && DTO[key].allowNull) {
            if (randomEven()) {
              modelObj[key] = faker.datatype.number({ min: -32768, max: 32767 });
            } else {
              modelObj[key] = null;
            }
          } else {
            modelObj[key] = faker.datatype.number({ min: -32768, max: 32767 });
          }
          break;
        case 'tinyint':
          if (DTO[key].hasOwnProperty('allowNull') && DTO[key].allowNull) {
            if (randomEven()) {
              modelObj[key] = faker.datatype.number({ min: -128, max: 127 });
            } else {
              modelObj[key] = null;
            }
          } else {
            modelObj[key] = faker.datatype.number({ min: -128, max: 127 });
          }
          break;
        case 'float':
        case 'double precision':
        case 'decimal':
        case 'real':
          if (DTO[key].hasOwnProperty('allowNull') && DTO[key].allowNull) {
            if (randomEven()) {
              modelObj[key] = faker.datatype.float();
            } else {
              modelObj[key] = null;
            }
          } else {
            modelObj[key] = faker.datatype.float();
          }
          break;
        case 'now':
          if (DTO[key].hasOwnProperty('allowNull') && DTO[key].allowNull) {
            if (randomEven()) {
              modelObj[key] = faker.datatype.datetime();
            } else {
              modelObj[key] = null;
            }
          } else {
            modelObj[key] = faker.datatype.datetime();
          }
          break;
        default:
          // console.log(`No content created for: ${key}, type: ${DTO[key].type.key}`);
          modelObj[key] = null;
          break;
      }
    }
  }
  return modelObj;
};

module.exports = randomByType;
