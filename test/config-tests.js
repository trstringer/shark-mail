const assert = require('chai').assert;
const configManager = require('../src/config-manager');

describe('configuration retrieval', () => {
  it('should successfully retrieve config object', () => {
    return configManager.getConfiguration()
      .then((config) => {
        assert.isDefined(config);
      })
      .catch((err) => {
        assert.fail(0, 1, err.message);
      });
  });
});