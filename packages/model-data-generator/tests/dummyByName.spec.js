const dummyScript = require('../src/generate');

describe('dummy script', () => {
  let dummyData;

  beforeAll(async () => {
    const dummyObj = await dummyScript('./src/db/models', [
      { model: 'test.model.js', howMany: 10, dryRun: true, createFile: false },
    ]);
    dummyData = dummyObj.insertedData[0].test;
  });

  describe('match by name', () => {
    describe('match FIRSTNAME', () => {
      it('should be populated', async () => {
        await dummyData.forEach((obj) => {
          expect(obj.firstName).toBeTruthy();
        });
      });
      it('should be alpha only, no spaces', async () => {
        await dummyData.forEach((obj) => {
          expect(obj.firstName).toEqual(expect.stringMatching(/^[a-zA-Z]*$/g));
          expect(obj.firstName).toEqual(expect.not.stringMatching(/[ ]+/g));
        });
      });
    });
    describe('match LASTNAME', () => {
      it('should be populated', async () => {
        await dummyData.forEach((obj) => {
          expect(obj.lastName).toBeTruthy();
        });
      });
      it('should be alpha only', async () => {
        await dummyData.forEach((obj) => {
          expect(obj.lastName).toEqual(expect.stringMatching(/[^ a-zA-Z']*$/g));
        });
      });
    });
    describe('match NAME and FULLNAME', () => {
      it('should be populated', async () => {
        await dummyData.forEach((obj) => {
          expect(obj.name).toBeTruthy();
          expect(obj.fullName).toBeTruthy();
        });
      });
      it('should have two alpha strings separated by a space', async () => {
        await dummyData.forEach((obj) => {
          expect(obj.name).toEqual(expect.stringMatching(/^[a-zA-Z]+( [a-zA-Z]+)*$/g));
          expect(obj.fullName).toEqual(expect.stringMatching(/^[a-zA-Z]+( [a-zA-Z]+)*$/g));
        });
      });
    });
    describe('match EMAIL', () => {
      it('should be populated', async () => {
        await dummyData.forEach((obj) => {
          expect(obj.email).toBeTruthy();
        });
      });
      it('has @ and . no whitespace', async () => {
        await dummyData.forEach((obj) => {
          expect(obj.email).toEqual(expect.stringMatching(/[^ ]+/g));
          expect(obj.email).toMatch(/[@]+/g);
          expect(obj.email).toMatch(/[.]+/g);
        });
      });
    });
    describe('match PASSWORD', () => {
      it('should be populated', async () => {
        await dummyData.forEach((obj) => {
          expect(obj.password).toBeTruthy();
        });
      });
      it('has no whitespace', async () => {
        await dummyData.forEach((obj) => {
          expect(obj.password).toEqual(expect.stringMatching(/^\S+$/));
        });
      });
    });
    describe('match MESSAGE or DESCRIPTION', () => {
      it('should be populated', async () => {
        await dummyData.forEach((obj) => {
          expect(obj.message).toBeTruthy();
          expect(obj.description).toBeTruthy();
        });
      });
      it('should have sentence structure', async () => {
        await dummyData.forEach((obj) => {
          expect(obj.message).toEqual(expect.stringMatching(/^[ a-zA-Z.]+$/g));
          expect(obj.description).toEqual(expect.stringMatching(/^[ a-zA-Z.]+$/g));
        });
      });
    });
    describe('match TIMEZONE', () => {
      it('should be populated', async () => {
        await dummyData.forEach((obj) => {
          expect(obj.timezone).toBeTruthy();
        });
      });
      it('has valid characters', async () => {
        await dummyData.forEach((obj) => {
          expect(obj.timezone).toEqual(expect.stringMatching(/^[A-Za-z0-9| _+-/.]*$/g));
        });
      });
    });
    describe('match ADDRESSONE', () => {
      it('should be populated', async () => {
        await dummyData.forEach((obj) => {
          expect(obj.addressOne).toBeTruthy();
        });
      });
      it('matches address pattern', async () => {
        await dummyData.forEach((obj) => {
          expect(obj.addressOne).toEqual(expect.stringMatching(/^[ a-zA-Z0-9]+$/g));
        });
      });
    });
    describe('match CITY', () => {
      it('should be populated', async () => {
        await dummyData.forEach((obj) => {
          expect(obj.city).toBeTruthy();
        });
      });
      it('matches city pattern', async () => {
        await dummyData.forEach((obj) => {
          expect(obj.city).toEqual(expect.stringMatching(/^[A-Z]+[a-z]+$/g));
        });
      });
    });
    describe('match STATE', () => {
      it('should be populated', async () => {
        await dummyData.forEach((obj) => {
          expect(obj.state).toBeTruthy();
        });
      });
      it('matches state pattern', async () => {
        await dummyData.forEach((obj) => {
          expect(obj.state).toEqual(expect.stringMatching(/^[A-Z]+$/g));
          expect(obj.state).toHaveLength(2);
        });
      });
    });
    describe('match COUNTRY', () => {
      it('should be populated', async () => {
        await dummyData.forEach((obj) => {
          expect(obj.country).toBeTruthy();
        });
      });
      it('matches country pattern', async () => {
        await dummyData.forEach((obj) => {
          expect(obj.state).toEqual(expect.stringMatching(/^[A-Z]+$/g));
          expect(obj.state).toHaveLength(2);
        });
      });
    });
    describe('match ZIP', () => {
      it('should be populated', async () => {
        await dummyData.forEach((obj) => {
          expect(obj.zip).toBeTruthy();
        });
      });
      it('matches zip pattern', async () => {
        await dummyData.forEach((obj) => {
          expect(obj.zip).toEqual(expect.stringMatching(/^[0-9]+$/g));
          expect(obj.zip).toHaveLength(5);
        });
      });
    });
    describe('match PHONE', () => {
      it('should be populated', async () => {
        await dummyData.forEach((obj) => {
          expect(obj.phone).toBeTruthy();
        });
      });
      it('matches phone pattern', async () => {
        await dummyData.forEach((obj) => {
          expect(obj.phone).toEqual(expect.stringMatching(/^[0-9]+$/g));
          expect(obj.phone).toHaveLength(10);
        });
      });
    });
    describe('NO MATCH BY NAME', () => {
      it('should create a column in the table', async () => {
        await dummyData.forEach((obj) => {
          expect(obj.noNameSupport).toBeDefined();
        });
      });
    });
  });
});
