const assert = require('chai').assert;
const configManager = require('../src/config-manager');
const testConfig = require('./config.js');
const emailUtil = require('../src/email-util');
const fs  = require('fs');

function createTestEmail(config) {
  return new Promise((resolve, reject) => {
    const filesystemOutboxPendingPath = config.filesystem.outboxPending;
    const testEmailFilename = `testemail-${Math.floor(Math.random() * 100000)}.email`;

    fs.writeFile(`${filesystemOutboxPendingPath}/${testEmailFilename}`, `${testConfig.testRecipient}\nthis is a email to be sent`, (err) => {
      if (err) {
        reject(err);
      }
      else {
        resolve(config);
      }
    });
  });
}

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
});

describe('emailing', () => {
  it('should send and archive emails', () => {
    return configManager.getConfiguration()
      .then(createTestEmail)
      .then(createTestEmail)
      .then(createTestEmail)
      .then(emailUtil.sendAndArchive)
      .catch(assert.isUndefined);
  });
});