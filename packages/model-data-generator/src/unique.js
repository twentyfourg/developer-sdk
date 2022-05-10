/* eslint-disable no-bitwise */
/* eslint-disable no-prototype-builtins */
const { faker } = require('@faker-js/faker');
const { nanoid } = require('nanoid');

const unique = (DTO, uniqueObj, howMany) => {
  Object.entries(DTO).forEach((key) => {
    if (key[1].hasOwnProperty('unique')) {
      const fieldName = key[0];

      if (!uniqueObj.hasOwnProperty(fieldName)) {
        uniqueObj[fieldName] = [];
      }
      // email
      if (
        fieldName.toLowerCase().includes('email') &&
        uniqueObj[fieldName] &&
        uniqueObj[fieldName].length === 0
      ) {
        for (let i = 0; i <= howMany * 2; i++) {
          uniqueObj[fieldName].push(`${nanoid(5)}@24g.com`);
        }
      }

      // type
      if (uniqueObj[fieldName].length === 0) {
        let strLength = 12;
        let textLength = 3;
        const uniqueStrChar = [];
        const uniqueText = [];
        const uniqueInt = [];
        const uniqueBigInt = [];
        const uniqueMedInt = [];
        const uniqueSmallInt = [];
        const uniqueTinyInt = [];
        const uniqueFloat = [];

        switch (key[1].type.key.toLowerCase()) {
          case 'string':
          case 'char':
            if (Object.keys(key[1]).includes('length')) {
              strLength = key[1].length;
            }
            for (let i = 0; i <= howMany * 2; i++) {
              uniqueStrChar.push(faker.unique(faker.datatype.string, { length: strLength }));
            }
            uniqueObj[fieldName] = uniqueStrChar;
            break;
          case 'text':
            if (Object.keys(key[1]).includes('length')) {
              if (key[1].length === 'tiny') {
                textLength = 2;
              } else if (key[1].length === 'medium') {
                textLength = 8;
              } else if (key[1].length === 'long') {
                textLength = 16;
              } else {
                console.log('Could not match constraint.');
              }
            }

            for (let i = 0; i <= howMany * 2; i++) {
              uniqueText.push(faker.unique(faker.lorem.sentences, { length: textLength }));
            }
            uniqueObj[fieldName] = uniqueText;
            break;
          case 'integer':
            for (let i = 0; i <= howMany * 2; i++) {
              uniqueInt.push(
                faker.unique(faker.datatype.number, { min: -2147483648, max: 2147483647 })
              );
            }
            uniqueObj[fieldName] = uniqueInt;
            break;
          case 'bigint':
            for (let i = 0; i <= howMany * 2; i++) {
              uniqueBigInt.push(faker.unique(faker.datatype.bigInt));
            }
            uniqueObj[fieldName] = uniqueBigInt;
            break;
          case 'mediumint':
            for (let i = 0; i <= howMany * 2; i++) {
              uniqueMedInt.push(
                faker.unique(faker.datatype.number, { min: -8388608, max: 8388608 })
              );
            }
            uniqueObj[fieldName] = uniqueMedInt;
            break;
          case 'smallint':
            for (let i = 0; i <= howMany * 2; i++) {
              uniqueSmallInt.push(faker.unique(faker.datatype.number, { min: -32768, max: 32767 }));
            }
            uniqueObj[fieldName] = uniqueSmallInt;
            break;
          case 'tinyint':
            for (let i = 0; i <= howMany * 2; i++) {
              uniqueTinyInt.push(faker.unique(faker.datatype.number, { min: -128, max: 127 }));
            }
            uniqueObj[fieldName] = uniqueTinyInt;
            break;
          case 'float':
          case 'decimal':
          case 'double precision':
          case 'real':
            for (let i = 0; i <= howMany * 2; i++) {
              uniqueFloat.push(faker.unique(faker.datatype.float));
            }
            uniqueObj[fieldName] = uniqueFloat;
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
