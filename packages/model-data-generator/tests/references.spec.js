const dummyScript = require('../src/generate');

describe('dummy script', () => {
  let dummyData;
  beforeAll(async () => {
    const dummyObj = await dummyScript('./src/db/models', [
      { model: 'test2.model.js', howMany: 2, dryRun: true, createFile: false },
    ]);
    dummyData = dummyObj.insertedData[0].test2;
  });

  describe('referenced field', () => {
    it('should be populated', async () => {
      dummyData.forEach((obj) => {
        expect(obj.roleId).toBeDefined();
      });
    });
    it('should have value from relevant column in referenced table', async () => {
      // how to test this?
    });
  });
});
