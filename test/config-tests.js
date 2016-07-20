const assert = require('chai').assert;
const configManager = require('../src/config-manager');

describe('configuration retrieval', () => {
  it('should successfully retrieve config object', (done) => {
    configManager.getConfiguration((err, config) => {
      if (err) {
        assert.fail(0, 1, err.message);
      }

      assert.isDefined(config);
      assert.isNotNull(config);
      
      done();
    });
  });
});