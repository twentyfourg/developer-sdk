/* eslint-disable no-prototype-builtins */
/* eslint-disable no-bitwise */
const Chance = require('chance');

const chance = new Chance();
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
                modelObj[key] = chance.string({ length: DTO[`${key}`].length });
              } else {
                modelObj[key] = chance.string();
              }
            } else {
              modelObj[key] = null;
            }
          } else if (
            !DTO[key].hasOwnProperty('allowNull') &&
            Object.keys(DTO[`${key}`]).includes('length')
          ) {
            modelObj[key] = chance.string({ length: DTO[`${key}`].length });
          } else {
            modelObj[key] = chance.string();
          }
          break;
        case 'text':
          if (DTO[key].hasOwnProperty('allowNull') && DTO[key].allowNull) {
            if (randomEven()) {
              if (Object.keys(DTO[`${key}`]).includes('length')) {
                if (DTO[`${key}`].length.toLowerCase() === 'tiny') {
                  modelObj[key] = chance.paragraph({ sentences: 1 });
                } else if (DTO[`${key}`].length.toLowerCase() === 'medium') {
                  modelObj[key] = chance.paragraph({ sentences: 6 });
                } else if (DTO[`${key}`].length.toLowerCase() === 'long') {
                  modelObj[key] = chance.paragraph({ sentences: 12 });
                } else {
                  console.log(`Could not parse length constraint for ${key}`);
                }
              } else {
                modelObj[key] = chance.paragraph({ sentences: 3 });
              }
            } else {
              modelObj[key] = null;
            }
          } else if (
            !DTO[key].hasOwnProperty('allowNull') &&
            Object.keys(DTO[`${key}`]).includes('length')
          ) {
            if (DTO[`${key}`].length.toLowerCase() === 'tiny') {
              modelObj[key] = chance.paragraph({ sentences: 1 });
            } else if (DTO[`${key}`].length.toLowerCase() === 'medium') {
              modelObj[key] = chance.paragraph({ sentences: 6 });
            } else if (DTO[`${key}`].length.toLowerCase() === 'long') {
              modelObj[key] = chance.paragraph({ sentences: 12 });
            } else {
              console.log(`Could not parse length constraint for ${key}`);
            }
          } else {
            modelObj[key] = chance.paragraph({ sentences: 3 });
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
              modelObj[key] = chance.integer({ min: -2147483648, max: 2147483647 });
            } else {
              modelObj[key] = null;
            }
          } else {
            modelObj[key] = chance.integer({ min: -2147483648, max: 2147483647 });
          }
          break;
        case 'bigint':
          if (DTO[key].hasOwnProperty('allowNull') && DTO[key].allowNull) {
            if (randomEven()) {
              modelObj[key] = chance.integer({ min: -2 ^ 63, max: (2 ^ 63) - 1 });
            } else {
              modelObj[key] = null;
            }
          } else {
            modelObj[key] = chance.integer({ min: -2 ^ 63, max: (2 ^ 63) - 1 });
          }
          break;
        case 'mediumint':
          if (DTO[key].hasOwnProperty('allowNull') && DTO[key].allowNull) {
            if (randomEven()) {
              modelObj[key] = chance.integer({ min: -8388608, max: 8388608 });
            } else {
              modelObj[key] = null;
            }
          } else {
            modelObj[key] = chance.integer({ min: -8388608, max: 8388608 });
          }
          break;
        case 'smallint':
          if (DTO[key].hasOwnProperty('allowNull') && DTO[key].allowNull) {
            if (randomEven()) {
              modelObj[key] = chance.integer({ min: -32768, max: 32767 });
            } else {
              modelObj[key] = null;
            }
          } else {
            modelObj[key] = chance.integer({ min: -32768, max: 32767 });
          }
          break;
        case 'tinyint':
          if (DTO[key].hasOwnProperty('allowNull') && DTO[key].allowNull) {
            if (randomEven()) {
              modelObj[key] = chance.integer({ min: -128, max: 127 });
            } else {
              modelObj[key] = null;
            }
          } else {
            modelObj[key] = chance.integer({ min: -128, max: 127 });
          }
          break;
        case 'float':
        case 'double precision':
        case 'decimal':
        case 'real':
          if (DTO[key].hasOwnProperty('allowNull') && DTO[key].allowNull) {
            if (randomEven()) {
              modelObj[key] = chance.floating();
            } else {
              modelObj[key] = null;
            }
          } else {
            modelObj[key] = chance.floating();
          }
          break;
        case 'now':
          if (DTO[key].hasOwnProperty('allowNull') && DTO[key].allowNull) {
            if (randomEven()) {
              modelObj[key] = chance.timestamp();
            } else {
              modelObj[key] = null;
            }
          } else {
            modelObj[key] = chance.timestamp();
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
