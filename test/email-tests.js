const assert = require('chai').assert;
const configManager = require('../src/config-manager');
const email = require('../src/email-client');
const testConfig = require('./config.js');

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
      text: 'test email body',
      to: testConfig.testRecipient
    };

    return configManager.getConfiguration()
      .then((config) => {
        emailOptions.from = config.sender.auth.user;
        return email.send(emailOptions, config.sender);
      })
      .then((res) => {
        assert.isDefined(res);
      })
      .catch((err) => {
        assert.isUndefined(err);
      });
  });
});