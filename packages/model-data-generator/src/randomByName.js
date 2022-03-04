const Chance = require('chance');
const bcrypt = require('bcrypt');

const chance = new Chance();
const randomEven = require('./util/randomEven');
const randomByType = require('./randomByType');

const randomByName = async (modelObj, DTO, uniqueObj) => {
  for (let i = 0; i < Object.keys(DTO).length; i++) {
    const current = Object.keys(DTO)[i];
    if (
      !Object.keys(DTO[current]).includes('defaultValue') &&
      !Object.keys(DTO[current]).includes('primaryKey') &&
      !modelObj[current]
    ) {
      if (Object.keys(DTO[current]).includes('unique')) {
        if (DTO[current].allowNull) {
          if (randomEven()) {
            modelObj[current] = '';
          } else {
            modelObj[current] = uniqueObj[current].pop();
          }
        } else {
          modelObj[current] = null;

          modelObj[current] = uniqueObj[current].pop();
        }
      } else if (current.toLowerCase().includes('link')) {
        if (Object.keys(DTO[current]) && DTO[current].allowNull) {
          if (randomEven()) {
            modelObj[current] = '';
          } else {
            modelObj[current] = chance.url();
          }
        } else {
          modelObj[current] = chance.url();
        }
      } else {
        switch (current.toLowerCase()) {
          // common keys
          case 'firstname':
            if (Object.keys(DTO[current]) && DTO[current].allowNull) {
              if (randomEven()) {
                modelObj[current] = '';
              } else {
                modelObj[current] = chance.first();
              }
            } else {
              modelObj[current] = chance.first();
            }
            break;
          case 'lastname':
            if (Object.keys(DTO[current]) && DTO[current].allowNull) {
              if (randomEven()) {
                modelObj[current] = '';
              } else {
                modelObj[current] = chance.last();
              }
            } else {
              modelObj[current] = chance.last();
            }
            break;
          case 'name':
          case 'fullname':
            if (Object.keys(DTO[current]) && DTO[current].allowNull) {
              if (randomEven()) {
                modelObj[current] = '';
              } else {
                modelObj[current] = chance.name();
              }
            } else {
              modelObj[current] = chance.name();
            }
            break;
          case 'email':
            if (!modelObj[current]) {
              if (Object.keys(DTO[current]) && DTO[current].allowNull) {
                if (randomEven()) {
                  modelObj[current] = '';
                } else {
                  modelObj[current] = 'test@24g.com';
                }
              } else {
                modelObj[current] = 'test@24g.com';
              }
            }
            break;
          case 'password':
            modelObj[current] = await bcrypt.hash('testpassword', 10);
            break;
          case 'message':
          case 'description':
            if (Object.keys(DTO[current]) && DTO[current].allowNull) {
              if (randomEven()) {
                modelObj[current] = '';
              } else {
                modelObj[current] = chance.sentence();
              }
            } else {
              modelObj[current] = chance.sentence();
            }
            break;
          case 'timezone':
            if (Object.keys(DTO[current]) && DTO[current].allowNull) {
              if (randomEven()) {
                modelObj[current] = '';
              } else {
                const randomTimeZone = chance.timezone();
                modelObj[current] = randomTimeZone.utc.shift() || randomTimeZone.name;
              }
            } else {
              const randomTimeZone = chance.timezone();
              modelObj[current] = randomTimeZone.utc.shift() || randomTimeZone.name;
            }
            break;
          case 'addressone':
            if (Object.keys(DTO[current]) && DTO[current].allowNull) {
              if (randomEven()) {
                modelObj[current] = '';
              } else {
                modelObj[current] = chance.address();
              }
            } else {
              modelObj[current] = chance.address();
            }
            break;
          case 'city':
            if (Object.keys(DTO[current]) && DTO[current].allowNull) {
              if (randomEven()) {
                modelObj[current] = '';
              } else {
                modelObj[current] = chance.city();
              }
            } else {
              modelObj[current] = chance.city();
            }
            break;
          case 'state':
            if (Object.keys(DTO[current]) && DTO[current].allowNull) {
              if (randomEven()) {
                modelObj[current] = '';
              } else {
                modelObj[current] = chance.state();
              }
            } else {
              modelObj[current] = chance.state();
            }
            break;
          case 'country':
            if (Object.keys(DTO[current]) && DTO[current].allowNull) {
              if (randomEven()) {
                modelObj[current] = '';
              } else {
                modelObj[current] = chance.country();
              }
            } else {
              modelObj[current] = chance.country();
            }
            break;
          case 'zip':
            if (Object.keys(DTO[current]) && DTO[current].allowNull) {
              if (randomEven()) {
                modelObj[current] = '';
              } else {
                modelObj[current] = chance.zip();
              }
            } else {
              modelObj[current] = chance.zip();
            }
            break;
          case 'phone':
            if (Object.keys(DTO[current]) && DTO[current].allowNull) {
              if (randomEven()) {
                modelObj[current] = '';
              } else {
                modelObj[current] = chance.phone({ formatted: false });
              }
            } else {
              modelObj[current] = chance.phone({ formatted: false });
            }
            break;
          // if no match, column created with null value
          default:
            modelObj[current] = null;
            break;
        }
      }
    }
  }
  randomByType(modelObj, DTO);

  return modelObj;
};

module.exports = randomByName;
