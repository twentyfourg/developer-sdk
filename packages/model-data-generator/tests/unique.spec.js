const dummyScript = require('../src/generate');

describe('dummy script', () => {
  let dummyData;
  let dummyUnique;
  let dummyObj;
  beforeAll(async () => {
    dummyData = await dummyScript('./src/db/models', [
      { model: 'test.model.js', howMany: 2, dryRun: true, createFile: false },
    ]);
    dummyObj = dummyData.insertedData[0].test;
    [dummyUnique] = dummyData.uniqueData;
  });
  expect.extend({
    toMatchUniqueKeys(received) {
      let count = 0;
      const receivedKeys = Object.keys(received[0]);
      for (let i = 0; i < receivedKeys.length; i++) {
        if (receivedKeys[i].slice(0, 6) === 'unique') {
          count++;
        }
      }
      const match = count === Object.keys(dummyUnique).length;
      if (match) {
        return {
          pass: true,
        };
      }
      return {
        pass: false,
        message: () =>
          `Expected ${receivedKeys} to have ${Object.keys(dummyUnique).length} unique keys`,
      };
    },
    toBeUnique(received) {
      let unique = true;
      for (let i = 0; i < received.length; i++) {
        const subArr = received.slice(i + 1, received.length);
        if (subArr.includes(received[i])) {
          unique = false;
          return {
            pass: false,
            message: () => `Expected ${received} to have unique values.`,
          };
        }
      }
      if (unique) {
        return {
          pass: true,
        };
      }
    },
  });
  describe('guarantee UNIQUE values', () => {
    describe('unique object', () => {
      it('should be populated', async () => {
        expect(dummyUnique).toBeTruthy();
      });
      it('should have correct amount of keys', async () => {
        expect(dummyObj).toMatchUniqueKeys();
      });
      it('should have correct amount of values per key', async () => {
        for (let i = 0; i < Object.keys(dummyUnique); i++) {
          expect(dummyUnique[i]).toHaveLength(20);
        }
      });
      it('should have all unique values for each key', async () => {
        Object.keys(dummyUnique).forEach((item) => {
          expect(dummyUnique[item]).toBeUnique();
        });
      });
    });
  });
});
