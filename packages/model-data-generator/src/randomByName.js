const { faker } = require('@faker-js/faker');
const bcrypt = require('bcrypt');
const { nanoid } = require('nanoid');

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
            modelObj[current] = faker.internet.url();
          }
        } else {
          modelObj[current] = faker.internet.url();
        }
      } else if (current.toLowerCase().includes('email')) {
        if (Object.keys(DTO[current]) && DTO[current].allowNull) {
          if (randomEven()) {
            modelObj[current] = '';
          } else {
            modelObj[current] = `${nanoid(5)}@24g.com`;
          }
        } else {
          modelObj[current] = `${nanoid(5)}@24g.com`;
        }
      } else {
        switch (current.toLowerCase()) {
          // common keys
          case 'firstname':
            if (Object.keys(DTO[current]) && DTO[current].allowNull) {
              if (randomEven()) {
                modelObj[current] = '';
              } else {
                modelObj[current] = faker.name.firstName();
              }
            } else {
              modelObj[current] = faker.name.firstName();
            }
            break;
          case 'lastname':
            if (Object.keys(DTO[current]) && DTO[current].allowNull) {
              if (randomEven()) {
                modelObj[current] = '';
              } else {
                modelObj[current] = faker.name.lastName();
              }
            } else {
              modelObj[current] = faker.name.lastName();
            }
            break;
          case 'name':
          case 'fullname':
            if (Object.keys(DTO[current]) && DTO[current].allowNull) {
              if (randomEven()) {
                modelObj[current] = '';
              } else {
                modelObj[current] = faker.name.findName();
              }
            } else {
              modelObj[current] = faker.name.findName();
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
                modelObj[current] = faker.lorem.sentence();
              }
            } else {
              modelObj[current] = faker.lorem.sentence();
            }
            break;
          case 'timezone':
            if (Object.keys(DTO[current]) && DTO[current].allowNull) {
              if (randomEven()) {
                modelObj[current] = '';
              } else {
                modelObj[current] = faker.address.timeZone();
              }
            } else {
              modelObj[current] = faker.address.timeZone();
            }
            break;
          case 'addressone':
            if (Object.keys(DTO[current]) && DTO[current].allowNull) {
              if (randomEven()) {
                modelObj[current] = '';
              } else {
                modelObj[current] = faker.address.streetAddress();
              }
            } else {
              modelObj[current] = faker.address.streetAddress();
            }
            break;
          case 'city':
            if (Object.keys(DTO[current]) && DTO[current].allowNull) {
              if (randomEven()) {
                modelObj[current] = '';
              } else {
                modelObj[current] = faker.address.city();
              }
            } else {
              modelObj[current] = faker.address.city();
            }
            break;
          case 'state':
            if (Object.keys(DTO[current]) && DTO[current].allowNull) {
              if (randomEven()) {
                modelObj[current] = '';
              } else {
                modelObj[current] = faker.address.stateAbbr();
              }
            } else {
              modelObj[current] = faker.address.stateAbbr();
            }
            break;
          case 'country':
            if (Object.keys(DTO[current]) && DTO[current].allowNull) {
              if (randomEven()) {
                modelObj[current] = '';
              } else {
                modelObj[current] = faker.address.country();
              }
            } else {
              modelObj[current] = faker.address.country();
            }
            break;
          case 'zip':
            if (Object.keys(DTO[current]) && DTO[current].allowNull) {
              if (randomEven()) {
                modelObj[current] = '';
              } else {
                modelObj[current] = faker.address.zipCode('#####');
              }
            } else {
              modelObj[current] = faker.address.zipCode('#####');
            }
            break;
          case 'phone':
            if (Object.keys(DTO[current]) && DTO[current].allowNull) {
              if (randomEven()) {
                modelObj[current] = '';
              } else {
                modelObj[current] = faker.phone.phoneNumber('###-###-####');
              }
            } else {
              modelObj[current] = faker.phone.phoneNumber('###-###-####');
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
