const dummyScript = require('../src/generate');

describe('dummy script', () => {
  let dummyData;
  beforeAll(async () => {
    const dummyObj = await dummyScript('./src/db/models', [
      { model: 'test.model.js', howMany: 10, dryRun: true, createFile: false },
    ]);
    dummyData = dummyObj.insertedData[0].test;
  });
  expect.extend({
    toHaveSentenceCount(received, expectedLength) {
      let count = 0;
      for (let i = 0; i < received.length; i++) {
        if (received[i] === '.') {
          count++;
        }
      }
      const match = count === expectedLength;
      if (match) {
        return {
          pass: true,
        };
      }
      return {
        pass: false,
        message: () => `Expected ${received} to have ${expectedLength} sentences`,
      };
    },
    toBeWithinRange(received, floor, ceiling) {
      const pass = received >= floor && received <= ceiling;
      if (pass) {
        return {
          message: () => `expected ${received} not to be within range ${floor} - ${ceiling}`,
          pass: true,
        };
      }
      return {
        message: () => `expected ${received} to be within range ${floor} - ${ceiling}`,
        pass: false,
      };
    },
  });
  describe('match by type', () => {
    describe('STRING | CHAR', () => {
      it('should be populated', async () => {
        dummyData.forEach((obj) => {
          expect(obj.randomString).toBeTruthy();
          expect(obj.randomChar).toBeTruthy();
        });
      });
      it('has no whitespace', async () => {
        dummyData.forEach((obj) => {
          expect(obj.randomString).toEqual(expect.not.stringMatching(/[ ]+/g));
          expect(obj.randomChar).toEqual(expect.not.stringMatching(/[ ]+/g));
        });
      });
      it('respects length constraint', async () => {
        dummyData.forEach((obj) => {
          expect(obj.randomStringLength).toHaveLength(12);
          expect(obj.randomCharLength).toHaveLength(12);
        });
      });
    });
    describe('TEXT', () => {
      it('should be populated', async () => {
        dummyData.forEach((obj) => {
          expect(obj.randomText).toBeTruthy();
        });
      });
      it('matches pattern', async () => {
        dummyData.forEach((obj) => {
          expect(obj.randomText).toEqual(expect.stringMatching(/^[ a-zA-Z.]+$/g));
        });
      });
      it('respects length constraint', async () => {
        dummyData.forEach((obj) => {
          expect(obj.randomText).toHaveSentenceCount(3);
          expect(obj.randomTextTiny).toHaveSentenceCount(1);
          expect(obj.randomTextMedium).toHaveSentenceCount(6);
          expect(obj.randomTextLong).toHaveSentenceCount(12);
        });
      });
    });
    describe('BOOLEAN', () => {
      it('should be populated', async () => {
        dummyData.forEach((obj) => {
          expect(obj.randomBoolean).toBeDefined();
        });
      });
      it('contains boolean as either a 0 or a 1', async () => {
        dummyData.forEach((obj) => {
          expect([0, 1]).toContain(obj.randomBoolean);
        });
      });
    });
    describe('INTEGER', () => {
      it('should be populated', async () => {
        dummyData.forEach((obj) => {
          expect(obj.randomInteger).toBeDefined();
        });
      });
      it('contains only numeric char or -', async () => {
        dummyData.forEach((obj) => {
          expect(String(obj.randomInteger)).toMatch(/^[-]|[0-9]/g);
        });
      });
      it('is in proper range', async () => {
        dummyData.forEach((obj) => {
          expect(obj.randomInteger).toBeWithinRange(-2147483648, 2147483647);
        });
      });
    });
    describe('BIGINT', () => {
      it('should be populated', async () => {
        dummyData.forEach((obj) => {
          expect(obj.randomBigInt).toBeDefined();
        });
      });
      it('contains only numeric char or -', async () => {
        dummyData.forEach((obj) => {
          expect(String(obj.randomBigInt)).toMatch(/^[-]|[0-9]/g);
        });
      });
      it('is in proper range', async () => {
        dummyData.forEach((obj) => {
          expect(obj.randomBigInt).toBeWithinRange(-2 ^ 63, (2 ^ 63) - 1); // eslint-disable-line
        });
      });
    });
    describe('MEDIUMINT', () => {
      it('should be populated', async () => {
        dummyData.forEach((obj) => {
          expect(obj.randomMediumInt).toBeDefined();
        });
      });
      it('contains only numeric char or -', async () => {
        dummyData.forEach((obj) => {
          expect(String(obj.randomMediumInt)).toMatch(/^[-]|[0-9]/g);
        });
      });
      it('is in proper range', async () => {
        dummyData.forEach((obj) => {
          expect(obj.randomMediumInt).toBeWithinRange(-8388608, 8388608);
        });
      });
    });
    describe('SMALLINT', () => {
      it('should be populated', async () => {
        dummyData.forEach((obj) => {
          expect(obj.randomSmallInt).toBeDefined();
        });
      });
      it('contains only numeric char or -', async () => {
        dummyData.forEach((obj) => {
          expect(String(obj.randomSmallInt)).toMatch(/^[-]|[0-9]/g);
        });
      });
      it('is in proper range', async () => {
        dummyData.forEach((obj) => {
          expect(obj.randomSmallInt).toBeWithinRange(-32768, 32767);
        });
      });
    });
    describe('TINYINT', () => {
      it('should be populated', async () => {
        dummyData.forEach((obj) => {
          expect(obj.randomTinyInt).toBeDefined();
        });
      });
      it('contains only numeric char or -', async () => {
        dummyData.forEach((obj) => {
          expect(String(obj.randomTinyInt)).toMatch(/^[-]|[0-9]/g);
        });
      });
      it('is in proper range', async () => {
        dummyData.forEach((obj) => {
          expect(obj.randomTinyInt).toBeWithinRange(-128, 127);
        });
      });
    });
    describe('FLOAT | DOUBLE | DECIMAL | REAL', () => {
      it('should be populated', async () => {
        dummyData.forEach((obj) => {
          expect(obj.randomFloat).toBeDefined();
          expect(obj.randomDouble).toBeDefined();
          expect(obj.randomDecimal).toBeDefined();
          expect(obj.randomReal).toBeDefined();
        });
      });
      it('contains only numeric char, -, or .', async () => {
        dummyData.forEach((obj) => {
          expect(String(obj.randomFloat)).toMatch(/^[-]|[0-9.]/g);
          expect(String(obj.randomDouble)).toMatch(/^[-]|[0-9.]/g);
          expect(String(obj.randomDecimal)).toMatch(/^[-]|[0-9.]/g);
          expect(String(obj.randomReal)).toMatch(/^[-]|[0-9.]/g);
        });
      });
    });
    describe('NOW', () => {
      it('should be populated', async () => {
        dummyData.forEach((obj) => {
          expect(obj.randomNow).toBeDefined();
        });
      });
      it('contains only numeric char', async () => {
        dummyData.forEach((obj) => {
          expect(String(obj.randomNow)).toMatch(/^[0-9]/g);
        });
      });
    });
    describe('NO MATCH BY TYPE', () => {
      it('should be populated with null value', async () => {
        dummyData.forEach((obj) => {
          expect(obj.randomNoMatch).toBe(null);
        });
      });
    });
  });
});
