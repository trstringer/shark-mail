const assert = require('chai').assert;
const configManager = require('../src/config-manager');
const email = require('../src/email-client');

describe('configuration retrieval', () => {
  it('should retrieve config object', () => {
    return configManager.getConfiguration()
      .then((config) => {
        assert.isDefined(config);
      })
      .catch((err) => {
        assert.fail(0, 1, err.message);
      });
  });

  it('should send email', () => {
    const emailOptions = {
      subject: 'test email subject',
      body: 'test email body',
      recipient: 'tstringer@outlook.com'
    };

    return configManager.getConfiguration()
      .then((config) => {
        return email.send(emailOptions, config);
      })
      .then((res) => {
        assert.isDefined(res);
      })
      .catch((err) => {
        assert.isUndefined(err);
      });
  });
});