const assert = require('chai').assert;
const configManager = require('../src/config-manager');
const email = require('../src/email-client');
const testConfig = require('./config.js');
const emailUtil = require('../src/email-util');
const fs  = require('fs');

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

  it('should recognize email from directory', () => {
    // the order of events is the following:
    //  1. create a text file in the config.filesystem.outboxPending
    //  2. send email based off of these files in this directory
    //  3. move the sent emails/files to config.filesystem.outboxSent

    return configManager.getConfiguration()
      .then((config) => {
        return new Promise((resolve, reject) => {
          const filesystemOutboxPendingPath = config.filesystem.outboxPending;
          const testEmailFilename = `testemail-${Math.floor(Math.random() * 100000)}.email`;
          fs.writeFile(`${filesystemOutboxPendingPath}/${testEmailFilename}`, '*\nthis is a draft email', (err) => {
            if (err) {
              assert.fail(0, 1, err.message);
              reject(err);
            }
            else {
              resolve(config);
            }
          });
        });
      })
      .then((config) => {
        return emailUtil.pendingOutboxEmails(config.filesystem.outboxPending);
      })
      .then((emails) => {
        assert.isDefined(emails);
        assert.isTrue(Array.isArray(emails));
        assert.isTrue(emails.length > 0);
      })
      .catch((err) => {
        assert.isUndefined(err);
      });
  });

  it('should send email from directory', () => {
    return configManager.getConfiguration()
      .then((config) => {
        return new Promise((resolve, reject) => {
          const filesystemOutboxPendingPath = config.filesystem.outboxPending;
          const testEmailFilename = `testemail-${Math.floor(Math.random() * 100000)}.email`;
          fs.writeFile(`${filesystemOutboxPendingPath}/${testEmailFilename}`, `${testConfig.testRecipient}\nthis is a email to be sent`, (err) => {
            if (err) {
              assert.fail(0, 1, err.message);
              reject(err);
            }
            else {
              resolve(config);
            }
          });
        });
      })
      .then((config) => {
        return emailUtil.pendingOutboxEmails(config.filesystem.outboxPending)
          .then(emailUtil.parseEmailsToBeSent)
          .then((emailsToSend) => 
            Promise.all(
              emailsToSend.map(
                (emailToSend) => email.send(emailToSend, config.sender)))
            .then(() =>
              Promise.all(
                emailsToSend.map(
                  (emailSent) => { 
                    emailUtil.archiveEmail(emailSent, config.filesystem.outboxSent)
                  }))
          ));
      })
      .catch((err) => {
        assert.isUndefined(err);
      });
  });
});