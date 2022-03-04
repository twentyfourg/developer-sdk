const randomEven = require('../src/util/randomEven');

describe('references', () => {
  expect.extend({
    toBeBoolean(received) {
      return typeof received === 'boolean'
        ? {
            message: () => `expected ${received} to be boolean`,
            pass: true,
          }
        : {
            message: () => `expected ${received} to be boolean`,
            pass: false,
          };
    },
  });

  describe('randomEven function', () => {
    it('should return random boolean', async () => {
      expect(randomEven()).toBeBoolean();
      expect(randomEven()).toBeDefined();
    });
  });
});
