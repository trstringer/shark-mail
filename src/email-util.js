const fs = require('fs');

module.exports = (() => {
  function unreadInboxEmails() {
    return new Promise((resolve, reject) => {
      reject(Error('not implemented'));
    });
  }

  function pendingOutboxEmails(outboxPath) {
    return new Promise((resolve, reject) => {
      fs.readdir(outboxPath, (err, files) => {
        if (err) {
          reject(err);
        }
        else {
          const filesContent = files.map((emailFile) => {
            return {
              path: `${outboxPath}/${emailFile}`,
              text: fs.readFileSync(`${outboxPath}/${emailFile}`, 'utf8')
            };
          });

          resolve(filesContent);
        }
      });
    });
  }
  
  return {
    unreadInboxEmails,
    pendingOutboxEmails
  };
})();