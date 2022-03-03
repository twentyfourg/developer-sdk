/* eslint-disable no-bitwise */
/* eslint-disable no-prototype-builtins */
const { nanoid } = require('nanoid');
const Chance = require('chance');

const chance = new Chance();

const unique = (DTO, uniqueObj, howMany) => {
  Object.entries(DTO).forEach((key) => {
    if (key[1].hasOwnProperty('unique')) {
      const fieldName = key[0];

      if (!uniqueObj.hasOwnProperty(fieldName)) {
        uniqueObj[fieldName] = [];
      }
      // email
      if (uniqueObj.email && uniqueObj.email.length === 0) {
        uniqueObj.email = [];
        for (let i = 0; i <= howMany * 2; i++) {
          uniqueObj.email.push(`${nanoid(5)}@24g.com`);
        }
      }
      // try by name
      if (uniqueObj[fieldName].length === 0) {
        try {
          const randomData = chance[key[0]];
          uniqueObj[fieldName] = chance.unique(randomData, howMany * 2);
        } catch (err) {
          console.warn(
            `Cannot match ${key[0]} by name to spawn unique data. Attempting match by type.`
          );
        }
      }
      // try by type
      if (uniqueObj[fieldName].length === 0) {
        let strLength = 12;
        let textLength = 3;
        switch (key[1].type.key.toLowerCase()) {
          case 'string':
          case 'char':
            if (Object.keys(key[1]).includes('length')) {
              strLength = key[1].length;
            }
            uniqueObj[fieldName] = chance.unique(chance.string, howMany * 2, { length: strLength });
            break;
          case 'text':
            if (Object.keys(key[1]).includes('length')) {
              if (key[1].length === 'tiny') {
                textLength = 1;
              } else if (key[1].length === 'medium') {
                textLength = 6;
              } else if (key[1].length === 'long') {
                textLength = 12;
              } else {
                console.log('Could not match constraint.');
              }
            }
            uniqueObj[fieldName] = chance.unique(chance.paragraph, howMany * 2, {
              sentences: textLength,
            });
            break;
          case 'integer':
            uniqueObj[fieldName] = chance.unique(chance.integer, howMany * 2, {
              min: -2147483648,
              max: 2147483647,
            });
            break;
          case 'bigint':
            uniqueObj[fieldName] = chance.unique(chance.integer, howMany * 2, {
              min: -2 ^ 63,
              max: (2 ^ 63) - 1,
            });
            break;
          case 'mediumint':
            uniqueObj[fieldName] = chance.unique(chance.integer, howMany * 2, {
              min: -8388608,
              max: 8388608,
            });
            break;
          case 'smallint':
            uniqueObj[fieldName] = chance.unique(chance.integer, howMany * 2, {
              min: -32768,
              max: 32767,
            });
            break;
          case 'tinyint':
            uniqueObj[fieldName] = chance.unique(chance.integer, howMany * 2, {
              min: -128,
              max: 127,
            });
            break;
          case 'float':
          case 'decimal':
          case 'double precision':
          case 'real':
            uniqueObj[fieldName] = chance.unique(chance.floating, howMany * 2);
            break;
          default:
            console.log(
              `Cannot match ${key[0]} by type to spawn unique data. ${key[1].type.key} not supported.`
            );
            break;
        }
      }
    }
  });

  return uniqueObj;
};

module.exports = unique;
